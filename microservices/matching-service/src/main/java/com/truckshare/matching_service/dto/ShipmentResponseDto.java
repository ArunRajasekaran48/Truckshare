package com.truckshare.matching_service.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder

public class ShipmentResponseDto {
    private UUID id;
    private String businessUserId;
    private String fromLocation;
    private String toLocation;
    private Double requiredWeight;
    private Double requiredVolume;
    private Boolean isSplit;
    private ShipmentStatus status;
}
