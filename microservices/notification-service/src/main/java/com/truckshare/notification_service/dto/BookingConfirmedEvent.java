package com.truckshare.notification_service.dto;

import java.util.UUID;

public record BookingConfirmedEvent(
    UUID bookingId,
    UUID shipmentId,
    UUID truckId,
    String businessUserId,
    String truckOwnerId,
    Double agreedPrice
) {}
