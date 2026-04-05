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
import com.truckshare.truck_service.exception.InvalidDriverException;
import com.truckshare.truck_service.exception.DriverAlreadyAssignedException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.truckshare.truck_service.models.TruckPoint;

@Service
@AllArgsConstructor
@Slf4j
public class TruckService {

    private final TruckRepository truckRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final com.truckshare.truck_service.clients.UserClient userClient;

    public TruckResponseDTO createTruck(TruckRequestDTO truckRequestDTO) {
        Truck truck = TruckMapper.toEntity(truckRequestDTO);
        return TruckMapper.toDto(truckRepository.save(truck));
    }

    @Transactional(readOnly = true)
    public List<TruckResponseDTO> searchTrucks(String from, String to, Double requiredWeight, Double requiredVolume, Double requiredLength) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationWithCapacity(from, to, requiredWeight,
                requiredVolume, requiredLength != null ? requiredLength : 0.0, TruckStatus.AVAILABLE);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TruckResponseDTO getTruckById(UUID id) {
        return truckRepository.findById(id)
                .map(TruckMapper::toDto)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
    }

    @Transactional(readOnly = true)
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
        existingTruck.setCapacityLength(truckRequestDTO.getCapacityLength());
        existingTruck.setFromLocation(truckRequestDTO.getFromLocation());
        existingTruck.setToLocation(truckRequestDTO.getToLocation());
        existingTruck.setAvailableWeight(truckRequestDTO.getAvailableWeight());
        existingTruck.setAvailableVolume(truckRequestDTO.getAvailableVolume());
        existingTruck.setAvailableLength(truckRequestDTO.getAvailableLength());
        existingTruck.setPricePerKg(truckRequestDTO.getPricePerKg());
        existingTruck.setPricePerLength(truckRequestDTO.getPricePerLength());
        existingTruck.setStatus(TruckStatus.valueOf(truckRequestDTO.getStatus()));
        
        // Update points
        if (truckRequestDTO.getPoints() != null) {
            existingTruck.getPoints().clear();
            List<TruckPoint> newPoints = truckRequestDTO.getPoints().stream()
                .map(p -> TruckMapper.toPointEntity(p, existingTruck))
                .collect(Collectors.toList());
            existingTruck.getPoints().addAll(newPoints);
        }

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
    public TruckResponseDTO updateCapacity(UUID id, double bookedWeight, double bookedVolume, double bookedLength) {
        Truck existingTruck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
        if (bookedWeight > existingTruck.getAvailableWeight()) {
            throw new InsufficientCapacityException("Not enough available weight for booking.");
        }
        if (bookedLength > existingTruck.getAvailableLength()) {
            throw new InsufficientCapacityException("Not enough available length for booking.");
        }

        // Calculate the volume to deduct based on the length booked
        double volumeRatio = existingTruck.getCapacityVolume() / existingTruck.getCapacityLength();
        double calculatedBookedVolume = bookedLength * volumeRatio;

        // Take the max of explicitly requested volume and calculated volume to be safe
        double actualBookedVolume = Math.max(bookedVolume, calculatedBookedVolume);

        if (actualBookedVolume > existingTruck.getAvailableVolume()) {
            throw new InsufficientCapacityException("Not enough available volume for booking.");
        }

        existingTruck.setAvailableWeight(existingTruck.getAvailableWeight() - bookedWeight);
        existingTruck.setAvailableVolume(existingTruck.getAvailableVolume() - actualBookedVolume);
        existingTruck.setAvailableLength(existingTruck.getAvailableLength() - bookedLength);

        Truck savedTruck = truckRepository.save(existingTruck);
        publishCapacityUpdate(savedTruck);
        return TruckMapper.toDto(savedTruck);
    }

    /**
     * Restores previously reserved capacity when a booking is cancelled.
     */
    @org.springframework.transaction.annotation.Transactional
    public TruckResponseDTO restoreCapacity(UUID id, double cancelledWeight, double cancelledVolume, double cancelledLength) {
        Truck existingTruck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));

        double volumeRatio = existingTruck.getCapacityVolume() / existingTruck.getCapacityLength();
        double calculatedCancelledVolume = cancelledLength * volumeRatio;
        double actualCancelledVolume = Math.max(cancelledVolume, calculatedCancelledVolume);

        double newWeight = existingTruck.getAvailableWeight() + cancelledWeight;
        double newVolume = existingTruck.getAvailableVolume() + actualCancelledVolume;
        double newLength = existingTruck.getAvailableLength() + cancelledLength;

        // Cap to max capacity
        existingTruck.setAvailableWeight(Math.min(newWeight, existingTruck.getCapacityWeight()));
        existingTruck.setAvailableVolume(Math.min(newVolume, existingTruck.getCapacityVolume()));
        existingTruck.setAvailableLength(Math.min(newLength, existingTruck.getCapacityLength()));

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

    @Transactional(readOnly = true)
    public List<TruckResponseDTO> splitSearchTrucks(String from, String to) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationAndStatus(from, to, TruckStatus.AVAILABLE);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    public TruckResponseDTO assignDriver(UUID id, String driverId, String driverName) {
        // 1. Validate role via user-service
        com.truckshare.truck_service.clients.UserClient.UserResponse user = userClient.getUserByUserId(driverId);
        if (user == null || !"DRIVER".equals(user.getRole())) {
            throw new InvalidDriverException("User " + driverId + " is not a registered driver.");
        }
        if (!"AVAILABLE".equals(user.getDriverAvailability())) {
            throw new InvalidDriverException(
                "Driver " + driverId + " is currently " + user.getDriverAvailability() + ". Only AVAILABLE drivers can be assigned."
            );
        }

        // 2. Strict Check: Driver cannot be assigned to ANY other truck
        List<Truck> assignments = truckRepository.findByDriverId(driverId);
        for (Truck t : assignments) {
            if (!t.getId().equals(id)) {
                throw new DriverAlreadyAssignedException(
                    "Driver is already assigned to truck: " + t.getLicensePlate() + 
                    " (Status: " + t.getStatus() + "). Please unassign them first."
                );
            }
        }

        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
        truck.setDriverId(driverId);
        truck.setDriverName(user.getName() != null ? user.getName() : driverName);
        return TruckMapper.toDto(truckRepository.save(truck));
    }

    public TruckResponseDTO unassignDriver(UUID id) {
        Truck truck = truckRepository.findById(id)
                .orElseThrow(() -> new TruckNotFoundException("Truck not found with id: " + id));
        truck.setDriverId(null);
        truck.setDriverName(null);
        return TruckMapper.toDto(truckRepository.save(truck));
    }

    @Transactional(readOnly = true)
    public TruckResponseDTO getTruckByDriverId(String driverId) {
        List<Truck> trucks = truckRepository.findByDriverId(driverId);
        if (trucks.isEmpty()) return null;

        // If multiple exist (due to past bad data), prioritize the most "active" one
        Truck bestMatch = trucks.stream()
            .sorted((a, b) -> {
                int scoreA = getStatusPriority(a.getStatus());
                int scoreB = getStatusPriority(b.getStatus());
                return Integer.compare(scoreB, scoreA); // Higher priority first
            })
            .findFirst()
            .orElse(trucks.get(0));

        return TruckMapper.toDto(bestMatch);
    }

    private int getStatusPriority(TruckStatus status) {
        if (status == TruckStatus.IN_TRANSIT) return 3;
        if (status == TruckStatus.FULL) return 2;
        if (status == TruckStatus.AVAILABLE) return 1;
        return 0;
    }

    private void publishCapacityUpdate(Truck truck) {
        TruckCapacityUpdatedEvent event = new TruckCapacityUpdatedEvent(
                truck.getId(),
                truck.getAvailableWeight(),
                truck.getAvailableVolume(),
                truck.getAvailableLength(),
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
