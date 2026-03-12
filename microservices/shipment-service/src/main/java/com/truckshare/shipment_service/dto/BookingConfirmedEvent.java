package com.truckshare.shipment_service.dto;

import java.util.UUID;

public record BookingConfirmedEvent(
    UUID bookingId,
    UUID shipmentId,
    UUID truckId,
    Double allocatedWeight,
    Double allocatedVolume,
    Double allocatedLength,
    String truckOwnerId
) {}
