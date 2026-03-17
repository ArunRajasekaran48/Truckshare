package com.truckshare.shipment_service.dto;

import java.util.UUID;

public record TripStatusUpdatedEvent(
    UUID tripId,
    UUID shipmentId,
    UUID truckId,
    TripStatus status
) {}
