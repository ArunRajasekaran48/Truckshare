package com.truckshare.matching_service.dto;

import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
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
    private Double totalEstimatedPrice;
	private String status;
    private Instant createdAt ;
    private Instant updatedAt ;
    private List<TruckPointDTO> points = new ArrayList<>();
}