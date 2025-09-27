package com.truckshare.booking_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shipment_trucks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShipmentTruck {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID shipmentId;  // FK to Shipment

    @Column(nullable = false)
    private UUID truckId;     // FK to Truck Service

    @Column(nullable = false)
    private Double allocatedWeight;

    @Column(nullable = false)
    private Double allocatedVolume;

    // Payment fields
    private Boolean paymentConfirmed = false;

    @Column(length = 100)
    private String paymentReference; // simple text reference (e.g., UPI ref)

    private Instant paymentConfirmedAt; // set when acknowledged

    @CreationTimestamp
    private Instant createdAt;
}
