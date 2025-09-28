package com.truckshare.booking_service.service;

import com.truckshare.booking_service.dto.ShipmentResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "SHIPMENT-SERVICE")
public interface ShipmentClient {

    // Retrieve shipment details for validation
    @GetMapping("/shipments/{shipmentId}")
    ShipmentResponseDto getShipmentById(@PathVariable("shipmentId") UUID shipmentId);

    // Finalize allocation and set shipment to BOOKED
    @PutMapping("/shipments/{shipmentId}/allocate")
    void updateAllocation(
            @PathVariable("shipmentId") UUID shipmentId,
            @RequestParam("allocatedWeight") Double allocatedWeight,
            @RequestParam("allocatedVolume") Double allocatedVolume
    );

    //get truck ownerid by truck id
    // @GetMapping("/trucks/{truckId}/owner")
    // String getTruckOwnerId(@PathVariable("truckId") UUID truckId);
}
