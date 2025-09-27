package com.truckshare.booking_service.controller;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    // Acknowledge payment by truck owner
    @PutMapping("/{bookingId}/acknowledge-payment")
    public ResponseEntity<ShipmentTruckResponse> acknowledgePayment(
            @PathVariable UUID bookingId,
            @RequestBody String paymentReference) {
        ShipmentTruckResponse updated = bookingService.acknowledgePayment(bookingId, paymentReference);
        return ResponseEntity.ok(updated);
    }
}