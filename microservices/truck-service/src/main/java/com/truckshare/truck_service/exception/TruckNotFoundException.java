package com.truckshare.truck_service.exception;

public class TruckNotFoundException extends RuntimeException {
    public TruckNotFoundException(String message) {
        super(message);
    }
}
