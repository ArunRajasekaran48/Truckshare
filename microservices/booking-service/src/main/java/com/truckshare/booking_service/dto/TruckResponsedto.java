package com.truckshare.booking_service.dto;

import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class TruckResponsedto {
	private UUID id;
	private String ownerId;
	private String licensePlate;
	private String model;
	private Double capacityWeight;
	private Double capacityVolume;
	private String fromLocation;
	private String toLocation;
	private Double availableWeight;
	private Double availableVolume;
	private String status;
	private String driverId;
	private String driverName;
    private Instant createdAt ;
    private Instant updatedAt ;
    private List<TruckPointFeignDto> points = new ArrayList<>();
}
