package com.truckshare.booking_service.controller;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.exception.UnauthorizedRoleException;
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
    public ResponseEntity<ShipmentTruckResponse> bookTruck(
        @RequestHeader("UserId") String businessUserId,
        @RequestHeader("UserRole") String role,
        @RequestBody CreateBookingRequest request) {
        //only Business User can create booking 
        if (!"BUSINESS_USER".equals(role)) {
            throw new UnauthorizedRoleException("Only business users can create bookings");
        }
        //To do: Validate if the shipment belongs to the business user
        ShipmentTruckResponse booking = bookingService.createBooking(request);
        return ResponseEntity.ok(booking);
    }

    // Acknowledge payment by truck owner
    @PutMapping("/{bookingId}/acknowledge-payment")
    public ResponseEntity<ShipmentTruckResponse> acknowledgePayment(
            @RequestHeader("UserId") String truckOwnerId,
            @RequestHeader("UserRole") String role,
            @PathVariable UUID bookingId,
            @RequestBody String paymentReference) {
        if (!"TRUCK_OWNER".equals(role)) {
            throw new UnauthorizedRoleException("Only truck owners can acknowledge payment");
        }
        //To do: Validate if the booking belongs to the truck owner
        ShipmentTruckResponse updated = bookingService.acknowledgePayment(bookingId, paymentReference);
        return ResponseEntity.ok(updated);
    }
}