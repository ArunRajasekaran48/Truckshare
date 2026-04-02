package com.truckshare.matching_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Boarding / dropping stop on a truck route (mirrors truck-service TruckPointDTO JSON).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckPointDTO {
    private UUID id;
    private String name;
    /** BOARDING or DROPPING */
    private String type;
    private String scheduledTime;
    private String address;
}
