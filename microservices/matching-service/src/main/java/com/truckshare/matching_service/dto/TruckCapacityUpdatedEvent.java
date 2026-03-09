package com.truckshare.matching_service.dto;

import java.util.UUID;

public record TruckCapacityUpdatedEvent(
    UUID truckId,
    Double availableWeight,
    Double availableVolume,
    String status
) {}
