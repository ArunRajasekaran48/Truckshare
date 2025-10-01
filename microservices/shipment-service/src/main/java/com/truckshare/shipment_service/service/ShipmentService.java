package com.truckshare.shipment_service.service;

import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
import com.truckshare.shipment_service.entity.Shipment;
import com.truckshare.shipment_service.entity.ShipmentStatus;
import com.truckshare.shipment_service.exception.InvalidShipmentAllocationException;
import com.truckshare.shipment_service.exception.ShipmentAlreadyBookedException;
import com.truckshare.shipment_service.exception.ShipmentNotFoundException;
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
       Shipment shipment = shipmentRepository.findById(id)
           .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found with id: " + id));
       return ShipmentMapper.toDto(shipment);
    }

    public void updateShipmentStatus(UUID id, ShipmentStatus status) {
        Shipment shipment = shipmentRepository.findById(id)
            .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found with id: " + id));
        shipment.setStatus(status);
        shipmentRepository.save(shipment);
    }

    public ShipmentResponseDto updateShipment(
        UUID id, ShipmentRequestDto dto) {
        Shipment shipment = shipmentRepository.findById(id)
            .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found with id: " + id));
        shipment.setFromLocation(dto.getFromLocation());
        shipment.setToLocation(dto.getToLocation());
        shipment.setRequiredWeight(dto.getRequiredWeight());
        shipment.setRequiredVolume(dto.getRequiredVolume());
        shipment.setIsSplit(dto.getIsSplit());
        Shipment updatedShipment = shipmentRepository.save(shipment);
        return ShipmentMapper.toDto(updatedShipment);
    }

    public Shipment updateAllocation(UUID shipmentId, Double allocatedWeight, Double allocatedVolume) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ShipmentNotFoundException("Shipment not found with id: " + shipmentId));

        if (!shipment.getIsSplit()) {
            if (!shipment.getStatus().equals(ShipmentStatus.MATCHED)) {
                throw new ShipmentAlreadyBookedException(
                        "Shipment " + shipmentId + " is already booked or partially allocated");
            }

            if (allocatedWeight < shipment.getRequiredWeight()
                    || allocatedVolume < shipment.getRequiredVolume()) {
                throw new InvalidShipmentAllocationException(
                        "Non-split shipment must be fully allocated in one booking");
            }

            shipment.setAllocatedWeight(allocatedWeight);
            shipment.setAllocatedVolume(allocatedVolume);
            shipment.setStatus(ShipmentStatus.BOOKED);

        } else {
            double newWeight = shipment.getAllocatedWeight() + allocatedWeight;
            double newVolume = shipment.getAllocatedVolume() + allocatedVolume;

            if (newWeight > shipment.getRequiredWeight() || newVolume > shipment.getRequiredVolume()) {
                throw new InvalidShipmentAllocationException("Allocation exceeds shipment requirement");
            }

            shipment.setAllocatedWeight(newWeight);
            shipment.setAllocatedVolume(newVolume);

            if (newWeight==(shipment.getRequiredWeight())
                    && newVolume==(shipment.getRequiredVolume())) {
                shipment.setStatus(ShipmentStatus.BOOKED);
            } else {
                shipment.setStatus(ShipmentStatus.PARTIALLY_BOOKED);
            }
        }

        return shipmentRepository.save(shipment);
    }
}
