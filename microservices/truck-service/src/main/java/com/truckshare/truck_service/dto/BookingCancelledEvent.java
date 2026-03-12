package com.truckshare.truck_service.dto;

import java.util.UUID;

public record BookingCancelledEvent(
        UUID bookingId,
        UUID shipmentId,
        UUID truckId,
        Double allocatedWeight,
        Double allocatedVolume,
        Double allocatedLength) {
}
