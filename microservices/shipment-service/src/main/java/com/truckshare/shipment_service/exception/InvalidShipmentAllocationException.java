package com.truckshare.shipment_service.exception;

public class InvalidShipmentAllocationException extends RuntimeException {
    public InvalidShipmentAllocationException(String message) {
        super(message);
    }
}