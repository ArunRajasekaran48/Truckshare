package com.truckshare.matching_service.exception;

public class NoMatchingTrucksException extends RuntimeException {
    public NoMatchingTrucksException(String message) {
        super(message);
    }
}
