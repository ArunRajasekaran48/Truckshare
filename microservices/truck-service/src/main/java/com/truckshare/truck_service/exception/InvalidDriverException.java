package com.truckshare.truck_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidDriverException extends RuntimeException {
    public InvalidDriverException(String message) {
        super(message);
    }
}
