package com.truckshare.truck_service.dto;

import lombok.Data;

@Data
public class TruckRequestDTO {
	private String licensePlate;
	private String model;
	private Double capacityWeight;
	private Double capacityVolume;
	private Double capacityLength;
	private String fromLocation;
	private String toLocation;
	private Double availableWeight;
	private Double availableVolume;
	private Double availableLength;
	private Double pricePerKg;
	private Double pricePerLength;
	private String status;
	// This will be injected from JWT in the controller
	private String ownerId;
}
