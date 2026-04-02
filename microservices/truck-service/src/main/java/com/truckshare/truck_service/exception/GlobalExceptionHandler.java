package com.truckshare.truck_service.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(TruckNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTruckNotFound(TruckNotFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, "Truck Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(InsufficientCapacityException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientCapacity(InsufficientCapacityException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Insufficient Capacity", ex.getMessage(), request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, "Data Integrity Violation", "Duplicate or invalid data: " + ex.getRootCause().getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
    @ExceptionHandler(InvalidTruckStatusException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTruckStatus(InvalidTruckStatusException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid Truck Status", ex.getMessage(), request);
    }

    @ExceptionHandler(InvalidDriverException.class)
    public ResponseEntity<ErrorResponse> handleInvalidDriver(InvalidDriverException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid Driver", ex.getMessage(), request);
    }

    @ExceptionHandler(DriverAlreadyAssignedException.class)
    public ResponseEntity<ErrorResponse> handleDriverAlreadyAssigned(DriverAlreadyAssignedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, "Driver Already Assigned", ex.getMessage(), request);
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorResponse> handleFeignException(FeignException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.resolve(ex.status());
        if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        String message = "Internal service communication error";
        if (ex instanceof feign.FeignException.NotFound) {
            message = "The referenced user or resource was not found in the remote service.";
        }
        
        return buildResponse(status, "Service Communication Error", message, request);
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
