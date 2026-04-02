package com.truckshare.booking_service.service;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.truckshare.booking_service.dto.TruckResponsedto;

@FeignClient(name = "TRUCK-SERVICE")
public interface TruckClient {
    // get truck ownerid by truck id
    @GetMapping("/trucks/{truckId}/owner")
    String getTruckOwnerId(@PathVariable("truckId") UUID truckId);

    @PutMapping("/trucks/internal/reserve-capacity/{id}")
    void reserveCapacity(
            @PathVariable("id") UUID id,
            @RequestParam("weight") double weight,
            @RequestParam("volume") double volume,
            @RequestParam("length") double length);

    @PutMapping("/trucks/internal/restore-capacity/{id}")
    void restoreCapacity(
            @PathVariable("id") UUID id,
            @RequestParam("weight") double weight,
            @RequestParam("volume") double volume,
            @RequestParam("length") double length);

    @GetMapping("/trucks/getTrucksByOwner")
    java.util.List<TruckResponsedto> getTrucksByOwner(
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role);

    @GetMapping("/trucks/assigned-to/{driverId}")
    TruckResponsedto getTruckByDriverId(@PathVariable("driverId") String driverId);

    @GetMapping("/trucks/{id}")
    TruckResponsedto getTruckById(@PathVariable("id") UUID id);
}
