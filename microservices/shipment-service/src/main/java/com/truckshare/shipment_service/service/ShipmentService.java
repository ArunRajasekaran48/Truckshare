package com.truckshare.shipment_service.service;

import com.truckshare.shipment_service.dto.ShipmentCreatedEvent;
import com.truckshare.shipment_service.dto.ShipmentRequestDto;
import com.truckshare.shipment_service.dto.ShipmentResponseDto;
import com.truckshare.shipment_service.entity.Shipment;
import com.truckshare.shipment_service.entity.ShipmentStatus;
import com.truckshare.shipment_service.exception.InvalidShipmentAllocationException;
import com.truckshare.shipment_service.exception.ShipmentAlreadyBookedException;
import com.truckshare.shipment_service.exception.ShipmentNotFoundException;
import com.truckshare.shipment_service.mapper.ShipmentMapper;
import com.truckshare.shipment_service.repository.ShipmentRepository;
import com.truckshare.shipment_service.entity.OutboxEvent;
import com.truckshare.shipment_service.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final LocationService locationService;
    private final PricingService pricingService;

    @org.springframework.transaction.annotation.Transactional
    public ShipmentResponseDto createShipment(ShipmentRequestDto dto) {
        Shipment shipment = ShipmentMapper.toEntity(dto);

        // Calculate Location & Price
        enrichShipmentData(shipment);

        Shipment savedShipment = shipmentRepository.save(shipment);

        ShipmentCreatedEvent event = new ShipmentCreatedEvent(
                savedShipment.getId(),
                savedShipment.getFromLocation(),
                savedShipment.getToLocation(),
                savedShipment.getRequiredWeight(),
                savedShipment.getRequiredVolume(),
                savedShipment.getIsSplit());

        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Shipment")
                    .aggregateId(savedShipment.getId().toString())
                    .eventType("ShipmentCreatedEvent")
                    .payload(objectMapper.writeValueAsString(event))
                    .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved ShipmentCreatedEvent to outbox for shipment id: {}", savedShipment.getId());
        } catch (Exception e) {
            log.error("Failed to serialize ShipmentCreatedEvent", e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }

        return ShipmentMapper.toDto(savedShipment);
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

        enrichShipmentData(shipment);

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

            if (newWeight == (shipment.getRequiredWeight())
                    && newVolume == (shipment.getRequiredVolume())) {
                shipment.setStatus(ShipmentStatus.BOOKED);
            } else {
                shipment.setStatus(ShipmentStatus.PARTIALLY_BOOKED);
            }
        }

        return shipmentRepository.save(shipment);
    }

    private void enrichShipmentData(Shipment shipment) {
        try {
            double[] fromCoords = locationService.getCoordinates(shipment.getFromLocation());
            double[] toCoords = locationService.getCoordinates(shipment.getToLocation());

            if (fromCoords != null && toCoords != null) {
                shipment.setFromLat(fromCoords[0]);
                shipment.setFromLon(fromCoords[1]);
                shipment.setToLat(toCoords[0]);
                shipment.setToLon(toCoords[1]);

                Double distance = locationService.getDistanceKm(
                        fromCoords[0], fromCoords[1],
                        toCoords[0], toCoords[1]);
                shipment.setDistanceKm(distance);

                Double price = pricingService.calculateEstimatedPrice(
                        distance, shipment.getRequiredWeight(), shipment.getRequiredVolume());
                shipment.setEstimatedPrice(price);
            }
        } catch (Exception e) {
            log.error("Failed to enrich shipment with location/price data", e);
        }
    }
}
