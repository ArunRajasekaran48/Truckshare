package com.truckshare.booking_service.exception;

public class NonSplittableShipmentException extends RuntimeException {

    public NonSplittableShipmentException(String message) {
        super(message);
    }
}