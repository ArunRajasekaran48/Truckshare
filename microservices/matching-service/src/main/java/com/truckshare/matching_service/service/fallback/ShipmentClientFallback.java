package com.truckshare.matching_service.service.fallback;

import com.truckshare.matching_service.dto.ShipmentResponseDto;
import com.truckshare.matching_service.dto.ShipmentStatus;
import com.truckshare.matching_service.exception.ExternalServiceUnavailableException;
import com.truckshare.matching_service.service.ShipmentClient;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ShipmentClientFallback implements ShipmentClient {
    @Override
    public ShipmentResponseDto getShipmentById(UUID id) {
        throw new ExternalServiceUnavailableException("Shipment service is unavailable, please try again later.");
    }

    @Override
    public void updateShipmentStatus(UUID shipmentId, ShipmentStatus status) {
        throw new ExternalServiceUnavailableException("Shipment service is unavailable, please try again later.");
    }
}