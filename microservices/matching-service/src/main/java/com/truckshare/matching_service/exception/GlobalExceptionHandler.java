package com.truckshare.matching_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ShipmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleShipmentNotFound(ShipmentNotFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, "Shipment Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(NoMatchingTrucksException.class)
    public ResponseEntity<ErrorResponse> handleNoMatchingTrucks(NoMatchingTrucksException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, "No Matching Trucks Found", ex.getMessage(), request);
    }

    @ExceptionHandler(ExternalServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleExternalServiceUnavailable(ExternalServiceUnavailableException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, "External Service Unavailable", ex.getMessage(), request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Runtime Exception", ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage(), request);
    }
    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String error, String message,
                                                        HttpServletRequest request) {
        ErrorResponse payload = ErrorResponse.builder()
                .status(status.value())
                .error(error)
                .message(message)
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(payload);
    }
}
