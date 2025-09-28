package com.truckshare.shipment_service.controller;

import com.truckshare.shipment_service.entity.Shipment;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
import com.truckshare.shipment_service.entity.ShipmentStatus;
import com.truckshare.shipment_service.exception.UnauthorizedShipmentAccessException;
import com.truckshare.shipment_service.service.ShipmentService;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    private final ShipmentService shipmentService;

    @PostMapping
    public ResponseEntity<ShipmentResponseDto> createShipment(
            @RequestHeader("UserId") String businessUserId,
            @RequestHeader("UserRole") String role,
            @RequestBody ShipmentRequestDto dto) {
        if (!role.equals("BUSINESS_USER")) {
            throw new UnauthorizedShipmentAccessException("Only business users can create shipments");
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
            @RequestHeader("UserId") String businessUserId,
            @RequestHeader("UserRole") String role,
            @PathVariable UUID id, @RequestBody ShipmentRequestDto dto) {
        if (!role.equals("BUSINESS_USER")) {
            throw new UnauthorizedShipmentAccessException("Only business users can update shipments");
        }
        // check if the shipment belongs to the user
        ShipmentResponseDto existingShipment = shipmentService.getShipmentById(id);
        if (!existingShipment.getBusinessUserId().equals(businessUserId)) {
            throw new UnauthorizedShipmentAccessException("Shipment does not belong to the user");
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

    @PutMapping("/{shipmentId}/allocate")
    public ResponseEntity<Shipment> updateAllocation(
            @PathVariable UUID shipmentId,
            @RequestParam Double allocatedWeight,
            @RequestParam Double allocatedVolume) {
        Shipment updated = shipmentService.updateAllocation(shipmentId, allocatedWeight, allocatedVolume);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{shipmentId}/splittable")
    public ResponseEntity<Boolean> isSplittable(@PathVariable UUID shipmentId) {
        ShipmentResponseDto shipment = shipmentService.getShipmentById(shipmentId);
        return ResponseEntity.ok(shipment.getIsSplit());
    }
}
