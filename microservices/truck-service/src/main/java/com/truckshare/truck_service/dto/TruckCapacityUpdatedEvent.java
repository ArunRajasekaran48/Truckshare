package com.truckshare.truck_service.dto;

import java.util.UUID;

public record TruckCapacityUpdatedEvent(
    UUID truckId,
    Double availableWeight,
    Double availableVolume,
    String status
) {}
