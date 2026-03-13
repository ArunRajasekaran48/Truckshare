package com.truckshare.matching_service.dto;

import java.util.UUID;

public record ShipmentCreatedEvent(
    UUID id,
    String fromLocation,
    String toLocation,
    Double requiredWeight,
    Double requiredVolume,
    Double requiredLength,
    Boolean isSplit
) {}
