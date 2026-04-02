package com.truckshare.truck_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
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
	private String status;
	private String driverId;
	private String driverName;
    private Instant createdAt ;
    private Instant updatedAt ;
    private List<TruckPointDTO> points = new ArrayList<>();
    private Double totalEstimatedPrice;
}
