package com.truckshare.matching_service.service;

import com.truckshare.matching_service.dto.ShipmentResponseDto;
import com.truckshare.matching_service.dto.ShipmentStatus;
import com.truckshare.matching_service.dto.TruckResponseDTO;
import com.truckshare.matching_service.exception.ShipmentNotFoundException;
import com.truckshare.matching_service.exception.NoMatchingTrucksException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchingService {
    private final ShipmentClient shipmentClient;
    private final TruckClient truckClient;

    // public ResponseEntity<List<TruckResponseDTO>> findMatches(UUID shipmentId){
    // ShipmentResponseDto shipmentResponse =
    // shipmentClient.getShipmentById(shipmentId);
    // if (shipmentResponse == null) {
    // throw new ShipmentNotFoundException("Shipment not found with id: " +
    // shipmentId);
    // }
    // List<TruckResponseDTO> matchedTrucks;
    // if (!shipmentResponse.getIsSplit()) {
    // matchedTrucks = truckClient.searchTrucks(
    // shipmentResponse.getFromLocation(),
    // shipmentResponse.getToLocation(),
    // shipmentResponse.getRequiredWeight(),
    // shipmentResponse.getRequiredVolume()
    // );
    // } else {
    // matchedTrucks = truckClient.splitSearchTrucks(
    // shipmentResponse.getFromLocation(),
    // shipmentResponse.getToLocation()
    // );
    // }
    // if (matchedTrucks == null || matchedTrucks.isEmpty()) {
    // throw new NoMatchingTrucksException("No matching trucks found for shipment
    // ID: " + shipmentId);
    // }
    // shipmentClient.updateShipmentStatus(shipmentId, ShipmentStatus.MATCHED);
    // return ResponseEntity.ok(matchedTrucks);
    // }
    public ResponseEntity<List<TruckResponseDTO>> findMatches(UUID shipmentId) {
        ShipmentResponseDto shipmentResponse = shipmentClient.getShipmentById(shipmentId);
        if (shipmentResponse == null) {
            throw new ShipmentNotFoundException("Shipment not found with id: " + shipmentId);
        }

        // Prevent matching if the shipment is already fully booked or cancelled
        if (shipmentResponse.getStatus() == ShipmentStatus.BOOKED ||
                shipmentResponse.getStatus() == ShipmentStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Cannot find matches for a shipment that is already " + shipmentResponse.getStatus());
        }

        // Check if the shipment is already partially booked and is split
        if (shipmentResponse.getStatus() == ShipmentStatus.PARTIALLY_BOOKED && shipmentResponse.getIsSplit()) {
            // Calculate remaining capacity needed
            double remainingWeight = shipmentResponse.getRequiredWeight() - shipmentResponse.getAllocatedWeight();
            double remainingVolume = shipmentResponse.getRequiredVolume() - shipmentResponse.getAllocatedVolume();
            double remainingLength = shipmentResponse.getRequiredLength() - shipmentResponse.getAllocatedLength();

            // Search for trucks that can handle the remaining capacity
            List<TruckResponseDTO> matchedTrucks = truckClient.searchTrucks(
                    shipmentResponse.getFromLocation(),
                    shipmentResponse.getToLocation(),
                    remainingWeight,
                    remainingVolume,
                    remainingLength);

            if (matchedTrucks == null || matchedTrucks.isEmpty()) {
                throw new NoMatchingTrucksException(
                        "No matching trucks found for remaining capacity of shipment ID: " + shipmentId);
            }

            return ResponseEntity.ok(matchedTrucks);
        }

        // Original logic for new shipments
        List<TruckResponseDTO> matchedTrucks;
        if (!shipmentResponse.getIsSplit()) {
            matchedTrucks = truckClient.searchTrucks(
                    shipmentResponse.getFromLocation(),
                    shipmentResponse.getToLocation(),
                    shipmentResponse.getRequiredWeight(),
                    shipmentResponse.getRequiredVolume(),
                    shipmentResponse.getRequiredLength());
        } else {
            matchedTrucks = truckClient.splitSearchTrucks(
                    shipmentResponse.getFromLocation(),
                    shipmentResponse.getToLocation());
        }

        if (matchedTrucks == null || matchedTrucks.isEmpty()) {
            throw new NoMatchingTrucksException("No matching trucks found for shipment ID: " + shipmentId);
        }

        // Only update status if it's a new shipment
        if (shipmentResponse.getStatus() == ShipmentStatus.PENDING) {
            shipmentClient.updateShipmentStatus(shipmentId, ShipmentStatus.MATCHED);
        }

        // Apply Price Calculation: max(spacePrice, weightPrice)
        for(TruckResponseDTO truck : matchedTrucks) {
            double reqLen = shipmentResponse.getIsSplit() && shipmentResponse.getStatus() == ShipmentStatus.PARTIALLY_BOOKED ? 
                (shipmentResponse.getRequiredLength() - shipmentResponse.getAllocatedLength()) : shipmentResponse.getRequiredLength();
            double reqWt = shipmentResponse.getIsSplit() && shipmentResponse.getStatus() == ShipmentStatus.PARTIALLY_BOOKED ? 
                (shipmentResponse.getRequiredWeight() - shipmentResponse.getAllocatedWeight()) : shipmentResponse.getRequiredWeight();

            double spacePrice = reqLen * (truck.getPricePerLength() != null ? truck.getPricePerLength() : 0.0);
            double weightPrice = reqWt * (truck.getPricePerKg() != null ? truck.getPricePerKg() : 0.0);
            
            truck.setPrice(Math.max(spacePrice, weightPrice));
        }

        return ResponseEntity.ok(matchedTrucks);
    }

}
