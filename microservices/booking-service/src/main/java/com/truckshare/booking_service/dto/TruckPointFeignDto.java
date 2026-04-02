package com.truckshare.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckPointFeignDto {
    private UUID id;
    private String name;
    /** BOARDING or DROPPING */
    private String type;
    private String scheduledTime;
    private String address;
}
