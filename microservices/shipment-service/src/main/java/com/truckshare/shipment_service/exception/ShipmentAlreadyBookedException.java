package com.truckshare.shipment_service.exception;

public class ShipmentAlreadyBookedException extends RuntimeException {
    public ShipmentAlreadyBookedException(String message) {
        super(message);
    }
}