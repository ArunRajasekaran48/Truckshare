package com.truckshare.matching_service.service;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.truckshare.matching_service.dto.TruckResponseDTO;
import com.truckshare.matching_service.service.fallback.TruckClientFallback;

import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "TRUCK-SERVICE", fallback = TruckClientFallback.class)
public interface TruckClient {
    @GetMapping("/trucks/search")
    List<TruckResponseDTO> searchTrucks(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam Double requiredWeight,
            @RequestParam Double requiredVolume
    );

    @GetMapping("/trucks/split-search")
    List<TruckResponseDTO> splitSearchTrucks(
            @RequestParam String from,
            @RequestParam String to
    );
}
