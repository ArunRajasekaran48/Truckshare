package com.truckshare.shipment_service.service;

import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
import com.truckshare.shipment_service.entity.Shipment;
import com.truckshare.shipment_service.mapper.ShipmentMapper;
import com.truckshare.shipment_service.repository.ShipmentRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentResponseDto createShipment(ShipmentRequestDto dto) {
       Shipment shipment = ShipmentMapper.toEntity(dto);
       return ShipmentMapper.toDto(shipmentRepository.save(shipment));
    }
    
}
