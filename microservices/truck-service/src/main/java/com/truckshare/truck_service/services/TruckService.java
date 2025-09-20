package com.truckshare.truck_service.services;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
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
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocationWithCapacity(from, to, requiredWeight, requiredVolume);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    public TruckResponseDTO getTruckById(UUID id) {
        return truckRepository.findById(id)
                .map(TruckMapper::toDto)
                .orElse(null);
    }

    public List<TruckResponseDTO> searchTrucksByOwner(String ownerId) {
        List<Truck> trucks = truckRepository.findByOwnerId(ownerId);
        return trucks.stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    public TruckResponseDTO updateTruck(UUID id, TruckRequestDTO truckRequestDTO) {
        return truckRepository.findById(id)
                .map(existingTruck -> {
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
                })
                .orElse(null);
    }

    public void deleteTruck(UUID id) {
        truckRepository.deleteById(id);
    }

    public List<TruckResponseDTO> getAvailableTrucks() {
        return truckRepository.findByStatus(TruckStatus.AVAILABLE)
                .stream()
                .map(TruckMapper::toDto)
                .toList();
    }

    public TruckResponseDTO updateCapacity(UUID id, double bookedWeight, double bookedVolume) {
        return truckRepository.findById(id)
                .map(existingTruck -> {
                    if (bookedWeight > existingTruck.getAvailableWeight()) {
                        return null;
                    }
                    if (bookedVolume > existingTruck.getAvailableVolume()) {
                        return null;
                    }
                    //Reduce the booked weight and volume from available weight and volume
                    existingTruck.setAvailableWeight(existingTruck.getAvailableWeight() - bookedWeight);
                    existingTruck.setAvailableVolume(existingTruck.getAvailableVolume() - bookedVolume);
                    return TruckMapper.toDto(truckRepository.save(existingTruck));
                })
                .orElse(null);
    }
    public TruckResponseDTO updateStatus(UUID id, String status) {
        return truckRepository.findById(id)
                .map(existingTruck -> {
                    existingTruck.setStatus(TruckStatus.valueOf(status));
                    return TruckMapper.toDto(truckRepository.save(existingTruck));
                })
                .orElse(null);
    }
}
