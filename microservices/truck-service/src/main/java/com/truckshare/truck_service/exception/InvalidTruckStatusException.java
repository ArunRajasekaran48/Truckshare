package com.truckshare.truck_service.exception;

public class InvalidTruckStatusException extends RuntimeException {
    public InvalidTruckStatusException(String message) {
        super(message);
    }
    
}
