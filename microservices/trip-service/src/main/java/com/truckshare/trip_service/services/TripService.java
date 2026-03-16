package com.truckshare.trip_service.services;

import com.truckshare.trip_service.models.Trip;
import com.truckshare.trip_service.models.TripStatus;
import com.truckshare.trip_service.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripRepository;

    @Transactional
    public void createTrip(UUID bookingId, UUID shipmentId, UUID truckId) {
        log.info("Creating trip for booking: {}", bookingId);
        
        Trip trip = Trip.builder()
                .bookingId(bookingId)
                .shipmentId(shipmentId)
                .truckId(truckId)
                .status(TripStatus.PLANNED)
                .build();
        
        tripRepository.save(trip);
    }

    @Transactional
    public Trip updateTripStatus(UUID tripId, TripStatus status) {
        log.info("Updating trip status for trip: {} to {}", tripId, status);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        trip.setStatus(status);
        if (status == TripStatus.IN_TRANSIT && trip.getStartedAt() == null) {
            trip.setStartedAt(Instant.now());
        } else if (status == TripStatus.COMPLETED) {
            trip.setCompletedAt(Instant.now());
        }
        
        return tripRepository.save(trip);
    }

    @Transactional(readOnly = true)
    public Trip getTripById(UUID id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }
}
