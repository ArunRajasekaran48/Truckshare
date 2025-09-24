package com.truckshare.truck_service.controllers;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.services.TruckService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trucks")
@RequiredArgsConstructor
public class TruckController {
    private final TruckService truckService;

    @PostMapping("/add-truck")
    public ResponseEntity<TruckResponseDTO> addTruck(
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role,
            @RequestBody TruckRequestDTO truckRequestDTO) {
        System.out.println(ownerId + " " + role);
        if (!"TRUCK_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        truckRequestDTO.setOwnerId(ownerId);
        TruckResponseDTO createdTruck = truckService.createTruck(truckRequestDTO);
        return ResponseEntity.ok(createdTruck);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TruckResponseDTO>> searchTrucks(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam Double requiredWeight,
            @RequestParam Double requiredVolume) {
        List<TruckResponseDTO> trucks = truckService.searchTrucks(from, to, requiredWeight, requiredVolume);
        return ResponseEntity.ok(trucks);
    }

    @GetMapping("/split-search")
    public ResponseEntity<List<TruckResponseDTO>> splitSearchTrucks(
            @RequestParam String from,
            @RequestParam String to) {
        List<TruckResponseDTO> trucks = truckService.splitSearchTrucks(from, to);
        return ResponseEntity.ok(trucks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TruckResponseDTO> getTruckById(@PathVariable UUID id) {
        TruckResponseDTO truck = truckService.getTruckById(id);
        return ResponseEntity.ok(truck);
    }

    @GetMapping("/getTrucksByOwner")
    public ResponseEntity<List<TruckResponseDTO>> getTrucksByOwner(
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role) {
        if (!"TRUCK_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        List<TruckResponseDTO> trucks = truckService.searchTrucksByOwner(ownerId);
        return ResponseEntity.ok(trucks);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TruckResponseDTO> updateTruck(
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role,
            @PathVariable UUID id,
            @RequestBody TruckRequestDTO truckRequestDTO) {
        if (!"TRUCK_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        TruckResponseDTO existingTruck = truckService.getTruckById(id);
        if (existingTruck == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingTruck.getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }
        truckRequestDTO.setOwnerId(ownerId);
        TruckResponseDTO updatedTruck = truckService.updateTruck(id, truckRequestDTO);
        return ResponseEntity.ok(updatedTruck);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTruck(
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role,
            @PathVariable UUID id) {
        if (!"TRUCK_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        TruckResponseDTO existingTruck = truckService.getTruckById(id);
        if (existingTruck == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingTruck.getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }
        truckService.deleteTruck(id);
        return ResponseEntity
                .noContent().build();
    }

    @GetMapping("/available-trucks")
    public ResponseEntity<List<TruckResponseDTO>> getAvailableTrucks() {
        List<TruckResponseDTO> trucks = truckService.getAvailableTrucks();
        return ResponseEntity.ok(trucks);
    }

    @PutMapping("/update-capacity/{id}")
    public ResponseEntity<TruckResponseDTO> updateCapacity(
            @PathVariable UUID id,
            @RequestParam double bookedWeight,
            @RequestParam double bookedVolume,
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role) {
        if (!"TRUCK_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        TruckResponseDTO truck = truckService.getTruckById(id);
        if (truck == null) {
            return ResponseEntity.notFound().build();
        }
        if (!truck.getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }
        TruckResponseDTO updated = truckService.updateCapacity(id, bookedWeight, bookedVolume);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/update-status")
    public ResponseEntity<TruckResponseDTO> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role) {
        if (!"TRUCK_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        TruckResponseDTO truck = truckService.getTruckById(id);
        if (truck == null) {
            return ResponseEntity.notFound().build();
        }
        if (!truck.getOwnerId().equals(ownerId)) {
            return ResponseEntity.status(403).build();
        }
        if (!List.of("AVAILABLE", "IN_TRANSIT", "FULL", "UNAVAILABLE").contains(status)) {
            return ResponseEntity.status(400).build();
        }
        TruckResponseDTO updated = truckService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
