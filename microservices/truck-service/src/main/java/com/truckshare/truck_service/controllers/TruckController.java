package com.truckshare.truck_service.controllers;

import com.truckshare.truck_service.dto.TruckRequestDTO;
import com.truckshare.truck_service.dto.TruckResponseDTO;
import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.services.TruckService;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trucks")
@AllArgsConstructor
public class TruckController {

    private final TruckService truckService;

    @PostMapping("/add-truck")
    public ResponseEntity<TruckResponseDTO> addTruck(
        @RequestHeader("UserId") String ownerId,
        @RequestHeader("UserRole") String role,
        @RequestBody TruckRequestDTO truckRequestDTO) {
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
        @RequestParam String to) {
        List<TruckResponseDTO> trucks = truckService.searchTrucks(from, to);
        return ResponseEntity.ok(trucks);
    }
}
