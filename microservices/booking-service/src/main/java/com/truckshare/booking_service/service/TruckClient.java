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

    @PutMapping("/trucks/update-capacity/{truckId}")
    TruckResponsedto updateCapacity(
            @PathVariable("truckId") UUID truckId,
            @RequestParam("bookedWeight") Double bookedWeight,
            @RequestParam("bookedVolume") Double bookedVolume,
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role);

    @PutMapping("/trucks/{id}/update-status")
    void updateStatus(
            @PathVariable("id") UUID id,
            @RequestParam("status") String status,
            @RequestHeader("UserId") String ownerId,
            @RequestHeader("UserRole") String role);

}
