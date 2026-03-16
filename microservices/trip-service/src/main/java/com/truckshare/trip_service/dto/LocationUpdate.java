package com.truckshare.trip_service.dto;

import java.time.Instant;

public record LocationUpdate(
    Double lat,
    Double lng,
    Instant timestamp
) {}
