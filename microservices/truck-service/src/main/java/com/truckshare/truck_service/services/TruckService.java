package com.truckshare.truck_service.services;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.mapper.TruckMapper;
import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.repository.TruckRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TruckService {

    private final TruckRepository truckRepository;

    public TruckService(TruckRepository truckRepository) {
        this.truckRepository = truckRepository;
    }

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
}
