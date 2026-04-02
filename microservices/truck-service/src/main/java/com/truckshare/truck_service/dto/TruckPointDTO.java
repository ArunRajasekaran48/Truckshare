package com.truckshare.truck_service.dto;

import com.truckshare.truck_service.models.PointType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruckPointDTO {
    private UUID id;
    private String name;
    private PointType type;
    private String scheduledTime;
    private String address;
}
