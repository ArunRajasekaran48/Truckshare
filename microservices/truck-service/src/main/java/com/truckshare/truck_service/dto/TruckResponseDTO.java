package com.truckshare.truck_service.dto;

import lombok.Data;
import java.util.UUID;
import java.time.Instant;
@Data
public class TruckResponseDTO {
	private UUID id;
	private String ownerId;
	private String licensePlate;
	private String model;
	private Double capacityWeight;
	private Double capacityVolume;
	private String fromLocation;
	private String toLocation;
	private Double currentWeight;
	private Double currentVolume;
	private String status;
    private Instant createdAt ;
    private Instant updatedAt ;
}
