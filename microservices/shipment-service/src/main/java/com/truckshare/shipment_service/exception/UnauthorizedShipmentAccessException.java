package com.truckshare.shipment_service.exception;

public class UnauthorizedShipmentAccessException extends RuntimeException {
    public UnauthorizedShipmentAccessException(String message) {
        super(message);
    }
}
