package com.truckshare.shipment_service.exception;

public class ShipmentNotFoundException extends RuntimeException {
    public ShipmentNotFoundException(String message) {
        super(message);
    }
}
