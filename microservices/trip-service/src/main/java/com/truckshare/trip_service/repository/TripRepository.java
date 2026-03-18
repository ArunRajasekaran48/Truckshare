package com.truckshare.trip_service.repository;

import com.truckshare.trip_service.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripRepository extends JpaRepository<Trip, UUID> {
    Optional<Trip> findByBookingId(UUID bookingId);
}
