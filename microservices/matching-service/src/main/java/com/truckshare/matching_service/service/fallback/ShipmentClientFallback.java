package com.truckshare.matching_service.service.fallback;

import com.truckshare.matching_service.dto.ShipmentResponseDto;
import com.truckshare.matching_service.dto.ShipmentStatus;
import com.truckshare.matching_service.exception.ExternalServiceUnavailableException;
import com.truckshare.matching_service.service.ShipmentClient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ShipmentClientFallback implements ShipmentClient {
    private static final Logger log = LoggerFactory.getLogger(ShipmentClientFallback.class);
    @Override
    public ShipmentResponseDto getShipmentById(UUID id) {
        log.error("Circuit breaker triggered for getShipmentById with ID: {}", id);
        throw new ExternalServiceUnavailableException("Shipment service is unavailable, please try again later.!");
    }

    @Override
    public void updateShipmentStatus(UUID shipmentId, ShipmentStatus status) {
        log.error("Circuit breaker triggered for updateShipmentStatus with ID: {} and status: {}", shipmentId, status);
        throw new ExternalServiceUnavailableException("Shipment service is unavailable, please try again later.");
    }
}