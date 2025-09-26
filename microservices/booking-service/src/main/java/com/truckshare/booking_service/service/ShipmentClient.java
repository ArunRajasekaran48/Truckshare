package com.truckshare.booking_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "SHIPMENT-SERVICE")
public interface ShipmentClient {

    // Finalize allocation and set shipment to BOOKED
    @PutMapping("/shipments/{shipmentId}/allocate")
    void updateAllocation(
            @PathVariable("shipmentId") UUID shipmentId,
            @RequestParam("allocatedWeight") Double allocatedWeight,
            @RequestParam("allocatedVolume") Double allocatedVolume
    );
}
