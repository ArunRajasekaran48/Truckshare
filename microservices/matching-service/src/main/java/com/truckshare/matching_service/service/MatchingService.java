package com.truckshare.matching_service.service;

import com.truckshare.matching_service.dto.ShipmentResponseDto;
import com.truckshare.matching_service.dto.ShipmentStatus;
import com.truckshare.matching_service.dto.TruckResponseDTO;
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

    public ResponseEntity<List<TruckResponseDTO>> findMatches(UUID shipmentId){
        ShipmentResponseDto shipmentResponse =shipmentClient.getShipmentById(shipmentId);
        System.out.println("Searching trucks for: from=" + shipmentResponse.getFromLocation() +
        ", to=" + shipmentResponse.getToLocation() +
        ", weight=" + shipmentResponse.getRequiredWeight() +
        ", volume=" + shipmentResponse.getRequiredVolume());
        List<TruckResponseDTO> matchedTrucks=truckClient.searchTrucks(
                shipmentResponse.getFromLocation(),
                shipmentResponse.getToLocation(),
                shipmentResponse.getRequiredWeight(),
                shipmentResponse.getRequiredVolume()
                );
        if(matchedTrucks.isEmpty()){
            System.out.println("No matches found for shipment ID: " + shipmentId);
            return ResponseEntity.noContent().build();
        }
        shipmentClient.updateShipmentStatus(shipmentId, ShipmentStatus.MATCHED);
        return ResponseEntity.ok(matchedTrucks);
    }
}
