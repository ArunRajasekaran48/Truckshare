package com.truckshare.notification_service.dto;

import java.util.UUID;

public record TripStatusUpdatedEvent(
    UUID tripId,
    UUID shipmentId,
    UUID truckId,
    TripStatus status
) {}
