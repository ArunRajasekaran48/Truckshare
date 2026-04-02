package com.truckshare.truck_service.mapper;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.dto.TruckPointDTO;
import com.truckshare.truck_service.models.TruckPoint;
import java.util.stream.Collectors;

public class TruckMapper {
    public static Truck toEntity(TruckRequestDTO dto) {
        if (dto == null) return null;
        Truck truck = Truck.builder()
                .ownerId(dto.getOwnerId())
                .licensePlate(dto.getLicensePlate())
                .model(dto.getModel())
                .capacityWeight(dto.getCapacityWeight())
                .capacityVolume(dto.getCapacityVolume())
                .capacityLength(dto.getCapacityLength())
                .fromLocation(dto.getFromLocation())
                .toLocation(dto.getToLocation())
                .availableWeight(dto.getAvailableWeight())
                .availableVolume(dto.getAvailableVolume())
                .availableLength(dto.getAvailableLength())
                .pricePerKg(dto.getPricePerKg())
                .pricePerLength(dto.getPricePerLength())
                .status(dto.getStatus() != null ? com.truckshare.truck_service.models.TruckStatus.valueOf(dto.getStatus()) : com.truckshare.truck_service.models.TruckStatus.AVAILABLE)
                .build();
        
        if (dto.getPoints() != null) {
            truck.setPoints(dto.getPoints().stream()
                .map(p -> toPointEntity(p, truck))
                .collect(Collectors.toList()));
        }
        return truck;
    }

    public static TruckResponseDTO toDto(Truck truck) {
        if (truck == null) return null;
        TruckResponseDTO dto = new TruckResponseDTO();
        dto.setId(truck.getId());
        dto.setOwnerId(truck.getOwnerId());
        dto.setLicensePlate(truck.getLicensePlate());
        dto.setModel(truck.getModel());
        dto.setCapacityWeight(truck.getCapacityWeight());
        dto.setCapacityVolume(truck.getCapacityVolume());
        dto.setCapacityLength(truck.getCapacityLength());
        dto.setFromLocation(truck.getFromLocation());
        dto.setToLocation(truck.getToLocation());
        dto.setAvailableWeight(truck.getAvailableWeight());
        dto.setAvailableVolume(truck.getAvailableVolume());
        dto.setAvailableLength(truck.getAvailableLength());
        dto.setPricePerKg(truck.getPricePerKg());
        dto.setPricePerLength(truck.getPricePerLength());
        dto.setStatus(truck.getStatus() != null ? truck.getStatus().name() : null);
        dto.setDriverId(truck.getDriverId());
        dto.setDriverName(truck.getDriverName());
        dto.setCreatedAt(truck.getCreatedAt());
        dto.setUpdatedAt(truck.getUpdatedAt());
        
        if (truck.getPoints() != null) {
            dto.setPoints(truck.getPoints().stream()
                .map(TruckMapper::toPointDto)
                .collect(Collectors.toList()));
        }
        return dto;
    }

    public static TruckPoint toPointEntity(TruckPointDTO dto, Truck truck) {
        if (dto == null) return null;
        return TruckPoint.builder()
                .id(dto.getId())
                .name(dto.getName())
                .type(dto.getType())
                .scheduledTime(dto.getScheduledTime())
                .address(dto.getAddress())
                .truck(truck)
                .build();
    }

    public static TruckPointDTO toPointDto(TruckPoint entity) {
        if (entity == null) return null;
        return new TruckPointDTO(
                entity.getId(),
                entity.getName(),
                entity.getType(),
                entity.getScheduledTime(),
                entity.getAddress()
        );
    }
}   
