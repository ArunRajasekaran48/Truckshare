package com.truckshare.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateBookingRequest {
    private UUID shipmentId;
    private UUID truckId;
    private Double allocatedWeight;
    private Double allocatedVolume;
    private String businessUserId;
}

