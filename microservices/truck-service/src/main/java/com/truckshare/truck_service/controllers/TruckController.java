package com.truckshare.truck_service.controllers;

import com.truckshare.truck_service.models.Truck;
import com.truckshare.truck_service.services.TruckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trucks")
public class TruckController {

    private final TruckService truckService;

    public TruckController(TruckService truckService) {
        this.truckService = truckService;
    }

    @PostMapping
    public ResponseEntity<Truck> addTruck(@RequestBody Truck truck) {
        // Call service layer
        return ResponseEntity.ok(truckService.createTruck(truck));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Truck>> searchTrucks(
            @RequestParam String from,
            @RequestParam String to) {
        // Call service layer
        return ResponseEntity.ok(truckService.searchTrucks(from, to));
    }
}
