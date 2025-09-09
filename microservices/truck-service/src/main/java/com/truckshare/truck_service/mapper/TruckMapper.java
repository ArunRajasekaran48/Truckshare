package com.truckshare.truck_service.mapper;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.models.Truck;

public class TruckMapper {
    public static Truck toEntity(TruckRequestDTO dto) {
        if (dto == null) return null;
        return Truck.builder()
                .ownerId(dto.getOwnerId())
                .licensePlate(dto.getLicensePlate())
                .model(dto.getModel())
                .capacityWeight(dto.getCapacityWeight())
                .capacityVolume(dto.getCapacityVolume())
                .fromLocation(dto.getFromLocation())
                .toLocation(dto.getToLocation())
                .currentWeight(dto.getCurrentWeight() != null ? dto.getCurrentWeight() : 0d)
                .currentVolume(dto.getCurrentVolume() != null ? dto.getCurrentVolume() : 0d)
                .status(dto.getStatus() != null ? com.truckshare.truck_service.models.TruckStatus.valueOf(dto.getStatus()) : com.truckshare.truck_service.models.TruckStatus.AVAILABLE)
                .build();
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
        dto.setFromLocation(truck.getFromLocation());
        dto.setToLocation(truck.getToLocation());
        dto.setCurrentWeight(truck.getCurrentWeight());
        dto.setCurrentVolume(truck.getCurrentVolume());
        dto.setStatus(truck.getStatus() != null ? truck.getStatus().name() : null);
        dto.setCreatedAt(truck.getCreatedAt());
        dto.setUpdatedAt(truck.getUpdatedAt());
        return dto;
    }
}
