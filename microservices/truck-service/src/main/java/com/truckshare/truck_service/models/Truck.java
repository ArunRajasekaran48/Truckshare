package com.truckshare.truck_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

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

    @Version
    private Long version;

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    private String model;

    private Double capacityWeight;
    private Double capacityVolume;
    private Double capacityLength;

    @Column(nullable = false)
    private String fromLocation;

    @Column(nullable = false)
    private String toLocation;

    private Double availableWeight;
    private Double availableVolume;
    private Double availableLength;

    private Double pricePerKg;
    private Double pricePerLength;


    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TruckStatus status = TruckStatus.AVAILABLE;

    @CreationTimestamp
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
}
