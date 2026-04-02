package com.truckshare.trip_service.controllers;

import com.truckshare.trip_service.dto.LocationUpdate;
import com.truckshare.trip_service.models.Trip;
import com.truckshare.trip_service.models.TripStatus;
import com.truckshare.trip_service.services.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final ReactiveRedisTemplate<String, Object> redisTemplate;

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTrip(@PathVariable UUID id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Trip> updateStatus(@PathVariable UUID id, @RequestParam TripStatus status) {
        return ResponseEntity.ok(tripService.updateTripStatus(id, status));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Trip> getTripByBookingId(@PathVariable UUID bookingId) {
        try {
            return ResponseEntity.ok(tripService.getTripByBookingId(bookingId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/booking/{bookingId}/status")
    public ResponseEntity<Trip> updateStatusByBooking(@PathVariable UUID bookingId, @RequestParam TripStatus status) {
        try {
            Trip trip = tripService.getTripByBookingId(bookingId);
            return ResponseEntity.ok(tripService.updateTripStatus(trip.getId(), status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/pulse")
    public Mono<ResponseEntity<Void>> locationPulse(@PathVariable UUID id, @RequestBody LocationUpdate update) {
        String key = "trip:" + id + ":location";
        return redisTemplate.opsForValue().set(key, update)
                .map(success -> ResponseEntity.ok().build());
    }

    @GetMapping("/{id}/location")
    public Mono<ResponseEntity<Object>> getLatestLocation(@PathVariable UUID id) {
        String key = "trip:" + id + ":location";
        return redisTemplate.opsForValue().get(key)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
