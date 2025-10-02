package com.truckshare.truck_service.services;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.exception.TruckNotFoundException;
import com.truckshare.truck_service.exception.InsufficientCapacityException;
import com.truckshare.truck_service.exception.InvalidTruckStatusException;
import com.truckshare.truck_service.mapper.TruckMapper;
import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.models.TruckStatus;
import com.truckshare.truck_service.repository.TruckRepository;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TruckService {

    private final TruckRepository truckRepository;

    public TruckResponseDTO createTruck(TruckRequestDTO truckRequestDTO) {
        Truck truck = TruckMapper.toEntity(truckRequestDTO);
        return TruckMapper.toDto(truckRepository.save(truck));
    }

    public List<TruckResponseDTO> searchTrucks(String from, String to, Double requiredWeight, Double requiredVolume) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationWithCapacity(from, to, requiredWeight, requiredVolume, TruckStatus.AVAILABLE);
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
    return TruckMapper.toDto(truckRepository.save(existingTruck));
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
        return TruckMapper.toDto(truckRepository.save(existingTruck));
    }

   

    public TruckResponseDTO updateStatus(UUID id, String status) {
        if (!truckRepository.existsById(id)) {
            throw new TruckNotFoundException("Truck not found with id: " + id);
        }
        if (!status.equals("AVAILABLE") && !status.equals("IN_TRANSIT") && !status.equals("FULL") && !status.equals("UNAVAILABLE")) {
            throw new InvalidTruckStatusException("Invalid status: " + status);
        }
        return truckRepository.findById(id)
                .map(existingTruck -> {
                    existingTruck.setStatus(TruckStatus.valueOf(status));
                    return TruckMapper.toDto(truckRepository.save(existingTruck));
                })
                .orElse(null);
    }

    public List<TruckResponseDTO> splitSearchTrucks(String from, String to) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationAndStatus(from, to, TruckStatus.AVAILABLE);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }
}
