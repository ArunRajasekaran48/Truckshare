package com.truckshare.shipment_service.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shipments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String businessUserId;

    @Column(nullable = false)
    private String fromLocation;
    @Column(nullable = false)
    private String toLocation;

    @Column(nullable = false)
    private Double requiredWeight;
    @Column(nullable = false)
    private Double requiredVolume;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Double allocatedWeight = 0d;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Double allocatedVolume = 0d;

    @Column(nullable = false)
    private Boolean isSplit;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status = ShipmentStatus.PENDING;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
