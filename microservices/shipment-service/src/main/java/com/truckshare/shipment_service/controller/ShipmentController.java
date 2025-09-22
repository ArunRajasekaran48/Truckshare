package com.truckshare.shipment_service.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
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
        ShipmentResponseDto response = shipmentService.createShipment(dto);
        return ResponseEntity.ok(response);
    }
}
