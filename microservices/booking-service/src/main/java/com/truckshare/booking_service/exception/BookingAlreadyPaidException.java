package com.truckshare.booking_service.exception;

public class BookingAlreadyPaidException extends RuntimeException {

    public BookingAlreadyPaidException(String message) {
        super(message);
    }
}