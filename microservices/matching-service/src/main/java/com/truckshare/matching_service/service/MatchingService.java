package com.truckshare.matching_service.service;

import com.truckshare.matching_service.dto.ShipmentResponseDto;
import com.truckshare.matching_service.dto.TruckResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MatchingService {
    private ShipmentClient shipmentClient;
    private TruckClient truckClient;

    public ResponseEntity<List<TruckResponseDTO>> findMatches(UUID shipmentId){
        ShipmentResponseDto shipmentResponse =shipmentClient.getShipmentById(shipmentId);
        List<TruckResponseDTO> matchedTrucks=truckClient.searchTrucks(
                shipmentResponse.getFromLocation(),
                shipmentResponse.getToLocation(),
                shipmentResponse.getRequiredWeight(),
                shipmentResponse.getRequiredVolume()
                );
        if(matchedTrucks.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        shipmentClient.updateShipmentStatus(shipmentId, ShipmentStatus.MATCHED);
        return ResponseEntity.ok(matchedTrucks);
    }
}
