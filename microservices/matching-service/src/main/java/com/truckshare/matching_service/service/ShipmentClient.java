package com.truckshare.matching_service.service;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.truckshare.matching_service.dto.ShipmentResponseDto;
import com.truckshare.matching_service.dto.ShipmentStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.truckshare.matching_service.service.fallback.ShipmentClientFallback;

@FeignClient(name="SHIPMENT-SERVICE", fallback = ShipmentClientFallback.class)
public interface ShipmentClient {
    @GetMapping("/shipments/{id}")
    ShipmentResponseDto getShipmentById(@PathVariable("id") UUID id);

    @PutMapping("/shipments/{id}/status")
    void updateShipmentStatus(@PathVariable("id") UUID shipmentId, @RequestBody ShipmentStatus status);
}