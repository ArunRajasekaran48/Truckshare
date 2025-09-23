package com.truckshare.shipment_service.service;

import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
import com.truckshare.shipment_service.entity.Shipment;
import com.truckshare.shipment_service.entity.ShipmentStatus;
import com.truckshare.shipment_service.mapper.ShipmentMapper;
import com.truckshare.shipment_service.repository.ShipmentRepository;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentResponseDto createShipment(ShipmentRequestDto dto) {
       Shipment shipment = ShipmentMapper.toEntity(dto);
       return ShipmentMapper.toDto(shipmentRepository.save(shipment));
    }

    public ShipmentResponseDto getShipmentById(UUID id) {
       Shipment shipment = shipmentRepository.findById(id).orElse(null);
       return ShipmentMapper.toDto(shipment);
    }

    public void updateShipmentStatus(UUID id, ShipmentStatus status) {
        Shipment shipment = shipmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Shipment not found"));
        shipment.setStatus(status);
        shipmentRepository.save(shipment);
    }
}
