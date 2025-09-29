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

        // Check if the shipment is already partially booked and is split
        if (shipmentResponse.getStatus() == ShipmentStatus.PARTIALLY_BOOKED && shipmentResponse.getIsSplit()) {
            // Calculate remaining capacity needed
            double remainingWeight = shipmentResponse.getRequiredWeight() - shipmentResponse.getAllocatedWeight();
            double remainingVolume = shipmentResponse.getRequiredVolume() - shipmentResponse.getAllocatedVolume();

            // Search for trucks that can handle the remaining capacity
            List<TruckResponseDTO> matchedTrucks = truckClient.searchTrucks(
                    shipmentResponse.getFromLocation(),
                    shipmentResponse.getToLocation(),
                    remainingWeight,
                    remainingVolume);

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
                    shipmentResponse.getRequiredVolume());
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

        return ResponseEntity.ok(matchedTrucks);
    }

}
