package com.truckshare.booking_service.controller;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ShipmentTruckResponse> bookTruck(@RequestBody CreateBookingRequest request) {
        ShipmentTruckResponse booking = bookingService.createBooking(request);
        return ResponseEntity.ok(booking);
    }
}