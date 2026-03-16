package com.truckshare.trip_service.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trips")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID bookingId;

    @Column(nullable = false)
    private UUID shipmentId;

    @Column(nullable = false)
    private UUID truckId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TripStatus status = TripStatus.PLANNED;

    private Double currentLat;
    private Double currentLng;

    private Instant startedAt;
    private Instant completedAt;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
