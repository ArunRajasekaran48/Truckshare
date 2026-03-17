package com.truckshare.trip_service.dto;

import com.truckshare.trip_service.models.TripStatus;
import java.util.UUID;

public record TripStatusUpdatedEvent(
    UUID tripId,
    UUID shipmentId,
    UUID truckId,
    TripStatus status
) {}
