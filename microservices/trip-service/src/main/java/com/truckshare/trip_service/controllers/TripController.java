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
    public ResponseEntity<Trip> updateTripStatus(@PathVariable UUID id, @RequestParam TripStatus status) {
        return ResponseEntity.ok(tripService.updateTripStatus(id, status));
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

    @PutMapping("/stops/{stopId}/complete")
    public ResponseEntity<Void> completeStop(@PathVariable UUID stopId) {
        tripService.completeStop(stopId);
        return ResponseEntity.ok().build();
    }
}
