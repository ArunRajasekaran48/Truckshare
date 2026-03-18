package com.truckshare.trip_service.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.truckshare.trip_service.dto.LocationUpdate;
import com.truckshare.trip_service.dto.TripStatusUpdatedEvent;
import com.truckshare.trip_service.models.OutboxEvent;
import com.truckshare.trip_service.models.Trip;
import com.truckshare.trip_service.models.TripStatus;
import com.truckshare.trip_service.repository.OutboxEventRepository;
import com.truckshare.trip_service.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ReactiveRedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

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
            // Flush Redis location to DB on completion
            try {
                String key = "trip:" + tripId + ":location";
                Object locationObj = redisTemplate.opsForValue().get(key).block();
                if (locationObj instanceof LocationUpdate location) {
                    trip.setCurrentLat(location.lat());
                    trip.setCurrentLng(location.lng());
                    log.info("Flushed final location from Redis to DB for trip: {}", tripId);
                }
            } catch (Exception e) {
                log.warn("Failed to flush location from Redis to DB for trip: {}. Error: {}", tripId, e.getMessage());
            }
        }
        
        Trip savedTrip = tripRepository.save(trip);

        // Save status update event to outbox
        TripStatusUpdatedEvent event = new TripStatusUpdatedEvent(
                savedTrip.getId(),
                savedTrip.getShipmentId(),
                savedTrip.getTruckId(),
                savedTrip.getStatus()
        );

        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Trip")
                    .aggregateId(savedTrip.getId().toString())
                    .eventType("TripStatusUpdatedEvent")
                    .payload(objectMapper.writeValueAsString(event))
                    .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved TripStatusUpdatedEvent to outbox for trip: {}", savedTrip.getId());
        } catch (Exception e) {
            log.error("Failed to serialize TripStatusUpdatedEvent for trip: {}", savedTrip.getId(), e);
            // We don't throw here to avoid rolling back the status update, 
            // but in a production system you might want to.
        }

        return savedTrip;
    }

    @Transactional(readOnly = true)
    public Trip getTripById(UUID id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }
}
