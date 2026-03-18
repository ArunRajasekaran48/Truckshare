package com.truckshare.trip_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "trip_stops")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripStop {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID shipmentId;

    private String location;

    @Enumerated(EnumType.STRING)
    private StopType type;

    @Enumerated(EnumType.STRING)
    private StopStatus status;

    private Integer sequenceOrder;
}
