package com.truckshare.booking_service.dto;

import java.util.UUID;

public record BookingCreatedEvent(
    UUID bookingId,
    UUID shipmentId,
    UUID truckId,
    Double allocatedWeight,
    Double allocatedVolume,
    String businessUserId
) {}
