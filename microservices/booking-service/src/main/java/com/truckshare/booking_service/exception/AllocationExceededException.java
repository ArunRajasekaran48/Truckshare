package com.truckshare.booking_service.exception;

public class AllocationExceededException extends RuntimeException {

    public AllocationExceededException(String message) {
        super(message);
    }
}