package com.truckshare.shipment_service.controller;


import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
import com.truckshare.shipment_service.entity.ShipmentStatus;
import com.truckshare.shipment_service.service.ShipmentService;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    private final ShipmentService shipmentService;

   @PostMapping
    public ResponseEntity<ShipmentResponseDto> createShipment(
        @RequestHeader("UserId")String businessUserId,
        @RequestHeader("UserRole") String role,
        @RequestBody ShipmentRequestDto dto) {
        if(!role.equals("BUSINESS_USER")) {
            throw new RuntimeException("Only business users can create shipments");
        }
        dto.setBusinessUserId(businessUserId);
        dto.setStatus(ShipmentStatus.PENDING);
        ShipmentResponseDto response = shipmentService.createShipment(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponseDto> getShipmentById(@PathVariable UUID id) {
        ShipmentResponseDto shipment = shipmentService.getShipmentById(id);
        return ResponseEntity.ok(shipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShipmentResponseDto> updateShipment(
        @RequestHeader("UserId")String businessUserId,
        @RequestHeader("UserRole") String role,
        @PathVariable UUID id, @RequestBody ShipmentRequestDto dto) {
        if(!role.equals("BUSINESS_USER")) {
            throw new RuntimeException("Only business users can update shipments");
        }
        //check if the shipment belongs to the user
        ShipmentResponseDto existingShipment = shipmentService.getShipmentById(id);
        if(!existingShipment.getBusinessUserId().equals(businessUserId)) {
            throw new RuntimeException("Shipment does not belong to the user");
        }
        dto.setBusinessUserId(businessUserId);
        ShipmentResponseDto updatedShipment = shipmentService.updateShipment(id, dto);
        return ResponseEntity.ok(updatedShipment);
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateShipmentStatus(@PathVariable UUID id, @RequestBody ShipmentStatus status) {
        shipmentService.updateShipmentStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
