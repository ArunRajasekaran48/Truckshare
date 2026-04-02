package com.truckshare.truck_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DriverAlreadyAssignedException extends RuntimeException {
    public DriverAlreadyAssignedException(String message) {
        super(message);
    }
}
