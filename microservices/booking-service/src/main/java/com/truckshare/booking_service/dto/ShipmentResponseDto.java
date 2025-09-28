package com.truckshare.booking_service.dto;

import com.truckshare.booking_service.dto.enums.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Lightweight copy of the shipment-service response so booking-service can perform
 * pre-booking validation without depending directly on the shipment module.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShipmentResponseDto {
    private UUID id;
    private String businessUserId;
    private String fromLocation;
    private String toLocation;
    private Double requiredWeight;
    private Double requiredVolume;
    private Double allocatedWeight;
    private Double allocatedVolume;
    private Boolean isSplit;
    private ShipmentStatus status;
}