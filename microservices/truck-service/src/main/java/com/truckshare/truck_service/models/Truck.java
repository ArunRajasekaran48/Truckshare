package com.truckshare.truck_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

import java.time.LocalDateTime;

@Entity
@Table(name = "trucks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data

public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    private String model;

    private Double capacityWeight;
    private Double capacityVolume;

//    @Column(nullable = false)
    private String fromLocation;

//    @Column(nullable = false)
    private String toLocation;

    private Double currentWeight = 0d;
    private Double currentVolume = 0d;

    @Enumerated(EnumType.STRING)
    private TruckStatus status = TruckStatus.AVAILABLE;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters, setters
}
