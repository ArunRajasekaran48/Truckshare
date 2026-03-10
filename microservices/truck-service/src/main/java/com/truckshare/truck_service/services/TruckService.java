package com.truckshare.truck_service.services;

import com.truckshare.truck_service.dto.TruckCapacityUpdatedEvent;
import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.exception.TruckNotFoundException;
import com.truckshare.truck_service.exception.InsufficientCapacityException;
import com.truckshare.truck_service.exception.InvalidTruckStatusException;
import com.truckshare.truck_service.mapper.TruckMapper;
import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.models.TruckStatus;
import com.truckshare.truck_service.repository.TruckRepository;
import com.truckshare.truck_service.models.OutboxEvent;
import com.truckshare.truck_service.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class TruckService {

    private final TruckRepository truckRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    public TruckResponseDTO createTruck(TruckRequestDTO truckRequestDTO) {
        Truck truck = TruckMapper.toEntity(truckRequestDTO);
        return TruckMapper.toDto(truckRepository.save(truck));
    }

    public List<TruckResponseDTO> searchTrucks(String from, String to, Double requiredWeight, Double requiredVolume) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationWithCapacity(from, to, requiredWeight,
                requiredVolume, TruckStatus.AVAILABLE);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    public TruckResponseDTO getTruckById(UUID id) {
        return truckRepository.findById(id)
                .map(TruckMapper::toDto)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
    }

    public List<TruckResponseDTO> searchTrucksByOwner(String ownerId) {
        List<Truck> trucks = truckRepository.findByOwnerId(ownerId);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    public TruckResponseDTO updateTruck(UUID id, TruckRequestDTO truckRequestDTO) {
        Truck existingTruck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
        existingTruck.setLicensePlate(truckRequestDTO.getLicensePlate());
        existingTruck.setModel(truckRequestDTO.getModel());
        existingTruck.setCapacityWeight(truckRequestDTO.getCapacityWeight());
        existingTruck.setCapacityVolume(truckRequestDTO.getCapacityVolume());
        existingTruck.setFromLocation(truckRequestDTO.getFromLocation());
        existingTruck.setToLocation(truckRequestDTO.getToLocation());
        existingTruck.setAvailableWeight(truckRequestDTO.getAvailableWeight());
        existingTruck.setAvailableVolume(truckRequestDTO.getAvailableVolume());
        existingTruck.setStatus(TruckStatus.valueOf(truckRequestDTO.getStatus()));

        Truck savedTruck = truckRepository.save(existingTruck);
        publishCapacityUpdate(savedTruck);
        return TruckMapper.toDto(savedTruck);
    }

    public void deleteTruck(UUID id) {
        if (!truckRepository.existsById(id)) {
            throw new TruckNotFoundException("Truck not found with id: " + id);
        }
        truckRepository.deleteById(id);
    }

    public List<TruckResponseDTO> getAvailableTrucks() {
        return truckRepository.findByStatus(TruckStatus.AVAILABLE)
                .stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    @org.springframework.transaction.annotation.Transactional
    public TruckResponseDTO updateCapacity(UUID id, double bookedWeight, double bookedVolume) {
        Truck existingTruck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
        if (bookedWeight > existingTruck.getAvailableWeight()) {
            throw new InsufficientCapacityException("Not enough available weight for booking.");
        }
        if (bookedVolume > existingTruck.getAvailableVolume()) {
            throw new InsufficientCapacityException("Not enough available volume for booking.");
        }
        existingTruck.setAvailableWeight(existingTruck.getAvailableWeight() - bookedWeight);
        existingTruck.setAvailableVolume(existingTruck.getAvailableVolume() - bookedVolume);

        Truck savedTruck = truckRepository.save(existingTruck);
        publishCapacityUpdate(savedTruck);
        return TruckMapper.toDto(savedTruck);
    }

    /**
     * Restores previously reserved capacity when a booking is cancelled.
     */
    @org.springframework.transaction.annotation.Transactional
    public TruckResponseDTO restoreCapacity(UUID id, double cancelledWeight, double cancelledVolume) {
        Truck existingTruck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));

        double newWeight = existingTruck.getAvailableWeight() + cancelledWeight;
        double newVolume = existingTruck.getAvailableVolume() + cancelledVolume;

        // Cap to max capacity
        existingTruck.setAvailableWeight(Math.min(newWeight, existingTruck.getCapacityWeight()));
        existingTruck.setAvailableVolume(Math.min(newVolume, existingTruck.getCapacityVolume()));

        // Restore status to AVAILABLE if it was FULL and we have space now
        if (TruckStatus.FULL.equals(existingTruck.getStatus()) &&
                existingTruck.getAvailableWeight() > 0 &&
                existingTruck.getAvailableVolume() > 0) {
            existingTruck.setStatus(TruckStatus.AVAILABLE);
        }
        Truck savedTruck = truckRepository.save(existingTruck);
        publishCapacityUpdate(savedTruck);
        return TruckMapper.toDto(savedTruck);
    }

    public TruckResponseDTO updateStatus(UUID id, String status) {
        if (!truckRepository.existsById(id)) {
            throw new TruckNotFoundException("Truck not found with id: " + id);
        }
        if (!status.equals("AVAILABLE") && !status.equals("IN_TRANSIT") && !status.equals("FULL")
                && !status.equals("UNAVAILABLE")) {
            throw new InvalidTruckStatusException("Invalid status: " + status);
        }
        return truckRepository.findById(id)
                .map(existingTruck -> {
                    existingTruck.setStatus(TruckStatus.valueOf(status));
                    Truck savedTruck = truckRepository.save(existingTruck);
                    publishCapacityUpdate(savedTruck);
                    return TruckMapper.toDto(savedTruck);
                })
                .orElse(null);
    }

    public List<TruckResponseDTO> splitSearchTrucks(String from, String to) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationAndStatus(from, to, TruckStatus.AVAILABLE);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    private void publishCapacityUpdate(Truck truck) {
        TruckCapacityUpdatedEvent event = new TruckCapacityUpdatedEvent(
                truck.getId(),
                truck.getAvailableWeight(),
                truck.getAvailableVolume(),
                truck.getStatus().name());

        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Truck")
                    .aggregateId(truck.getId().toString())
                    .eventType("TruckCapacityUpdatedEvent")
                    .payload(objectMapper.writeValueAsString(event))
                    .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved TruckCapacityUpdatedEvent to outbox for truck id: {}", truck.getId());
        } catch (Exception e) {
            log.error("Failed to serialize TruckCapacityUpdatedEvent", e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }
    }
}
