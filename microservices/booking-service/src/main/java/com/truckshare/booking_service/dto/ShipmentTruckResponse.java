package com.truckshare.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShipmentTruckResponse {
    private UUID id;
    private UUID shipmentId;
    private UUID truckId;
    private Double allocatedWeight;
    private Double allocatedVolume;
    private Boolean paymentConfirmed;
    private String paymentReference;
    private Instant paymentConfirmedAt;
    private Instant createdAt;
}
