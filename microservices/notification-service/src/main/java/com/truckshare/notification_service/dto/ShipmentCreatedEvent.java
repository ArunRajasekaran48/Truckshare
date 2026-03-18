package com.truckshare.notification_service.dto;

import java.util.UUID;

public record ShipmentCreatedEvent(
    UUID shipmentId,
    String businessUserId,
    String fromLocation,
    String toLocation,
    Double requiredWeight,
    Double requiredVolume,
    Double requiredLength
) {}
