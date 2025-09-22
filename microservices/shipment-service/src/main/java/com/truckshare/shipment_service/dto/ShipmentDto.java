package com.truckshare.shipment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

import com.truckshare.shipment_service.entity.ShipmentStatus;

@Data
@AllArgsConstructor
@Builder

public class ShipmentDto {
    private UUID id;
    private UUID businessUserId;
    private String fromLocation;
    private String toLocation;
    private Double requiredWeight;
    private Double requiredVolume;
    private Boolean isSplit;
    private ShipmentStatus status;
}
