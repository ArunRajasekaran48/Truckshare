package com.truckshare.trip_service.repository;

import com.truckshare.trip_service.models.Trip;
import com.truckshare.trip_service.models.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {
    Optional<Trip> findFirstByTruckIdAndStatusIn(UUID truckId, List<TripStatus> statuses);
}
