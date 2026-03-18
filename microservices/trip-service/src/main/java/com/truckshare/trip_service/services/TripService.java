package com.truckshare.trip_service.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.truckshare.trip_service.dto.LocationUpdate;
import com.truckshare.trip_service.dto.TripStatusUpdatedEvent;
import com.truckshare.trip_service.models.*;
import com.truckshare.trip_service.repository.OutboxEventRepository;
import com.truckshare.trip_service.repository.TripRepository;
import com.truckshare.trip_service.repository.TripStopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripRepository;
    private final TripStopRepository tripStopRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @Transactional
    public void createTrip(UUID bookingId, UUID shipmentId, UUID truckId) {
        log.info("Processing booking: {} for truck: {}", bookingId, truckId);
        
        // Find if this truck already has an active journey
        List<TripStatus> activeStatuses = Arrays.asList(TripStatus.PLANNED, TripStatus.LOADING, TripStatus.IN_TRANSIT);
        Trip trip = tripRepository.findFirstByTruckIdAndStatusIn(truckId, activeStatuses)
                .orElseGet(() -> {
                    log.info("Creating new journey for truck: {}", truckId);
                    return Trip.builder()
                            .truckId(truckId)
                            .status(TripStatus.PLANNED)
                            .build();
                });

        // Add Pickup and Dropoff stops
        int nextSequence = trip.getStops().size();
        
        TripStop pickup = TripStop.builder()
                .shipmentId(shipmentId)
                .type(StopType.PICKUP)
                .status(StopStatus.PENDING)
                .sequenceOrder(nextSequence++)
                .build();

        TripStop dropoff = TripStop.builder()
                .shipmentId(shipmentId)
                .type(StopType.DROPOFF)
                .status(StopStatus.PENDING)
                .sequenceOrder(nextSequence++)
                .build();

        trip.getStops().add(pickup);
        trip.getStops().add(dropoff);
        
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
            flushLocationToDb(trip);
        }
        
        return tripRepository.save(trip);
    }

    @Transactional
    public void completeStop(UUID stopId) {
        log.info("Completing stop: {}", stopId);
        TripStop stop = tripStopRepository.findById(stopId)
                .orElseThrow(() -> new RuntimeException("Stop not found"));
        
        stop.setStatus(StopStatus.COMPLETED);
        tripStopRepository.save(stop);

        // Find the trip this stop belongs to so we can get IDs for the event
        // (In a real app, TripStop would have a @ManyToOne back to Trip)
        // Here we just broadcast the event for the shipmentId
        
        TripStatus syncStatus = (stop.getType() == StopType.PICKUP) ? TripStatus.IN_TRANSIT : TripStatus.COMPLETED;
        broadcastStatusUpdate(stop.getShipmentId(), syncStatus);
    }

    private void broadcastStatusUpdate(UUID shipmentId, TripStatus status) {
        TripStatusUpdatedEvent event = new TripStatusUpdatedEvent(
                null, // Trip ID not strictly needed by listeners who only care about shipment
                shipmentId,
                null,
                status
        );

        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Shipment")
                    .aggregateId(shipmentId.toString())
                    .eventType("TripStatusUpdatedEvent")
                    .payload(objectMapper.writeValueAsString(event))
                    .build();
            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to serialize status update for shipment: {}", shipmentId, e);
        }
    }

    private void flushLocationToDb(Trip trip) {
        try {
            String key = "trip:" + trip.getId() + ":location";
            Object locationObj = redisTemplate.opsForValue().get(key).block();
            if (locationObj instanceof LocationUpdate location) {
                trip.setCurrentLat(location.lat());
                trip.setCurrentLng(location.lng());
            }
        } catch (Exception e) {
            log.warn("Failed to flush location for trip: {}", trip.getId());
        }
    }

    @Transactional(readOnly = true)
    public Trip getTripById(UUID id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }
}
