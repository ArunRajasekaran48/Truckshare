package com.truckshare.truck_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;
import java.time.Instant;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TruckResponseDTO {
	private UUID id;
	private String ownerId;
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
	private Double price; // Dynamically calculated by matching service
	private String status;
    private Instant createdAt ;
    private Instant updatedAt ;
}
