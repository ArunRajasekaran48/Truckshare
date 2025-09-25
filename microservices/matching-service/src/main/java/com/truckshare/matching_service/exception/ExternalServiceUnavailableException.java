package com.truckshare.matching_service.exception;

/**
 * Thrown when a downstream service is unavailable or the circuit is open.
 */
public class ExternalServiceUnavailableException extends RuntimeException {
    public ExternalServiceUnavailableException(String message) {
        super(message);
    }
}