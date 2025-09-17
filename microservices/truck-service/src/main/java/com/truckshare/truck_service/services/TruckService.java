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

    public List<TruckResponseDTO> searchTrucks(String from, String to) {
        List<Truck> trucks = truckRepository.findByFromLocationAndToLocation(from, to);
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
                    existingTruck.setCurrentWeight(truckRequestDTO.getCurrentWeight());
                    existingTruck.setCurrentVolume(truckRequestDTO.getCurrentVolume());
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
}
