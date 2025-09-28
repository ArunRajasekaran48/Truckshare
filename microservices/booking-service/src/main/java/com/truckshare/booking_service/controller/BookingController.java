package com.truckshare.booking_service.controller;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.exception.ShipmentOwnershipException;
import com.truckshare.booking_service.exception.UnauthorizedRoleException;
import com.truckshare.booking_service.service.BookingService;
import com.truckshare.booking_service.service.ShipmentClient;

import feign.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    // private final ShipmentClient shipmentClient;
    @PostMapping
    public ResponseEntity<ShipmentTruckResponse> bookTruck(
        @RequestHeader("UserId") String businessUserId,
        @RequestHeader("UserRole") String role,
        @RequestBody CreateBookingRequest request) {
        //only Business User can create booking 
        if (!"BUSINESS_USER".equals(role)) {
            throw new UnauthorizedRoleException("Only business users can create bookings");
        }
        request.setBusinessUserId(businessUserId);
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
        //  if(!truckOwnerId.equals(shipmentClient.getTruckOwnerId(bookingService.getBookingById(bookingId).getTruckId()))) {
        //      throw new ShipmentOwnershipException("This booking does not belong to the truck owner");
        //  }

        ShipmentTruckResponse updated = bookingService.acknowledgePayment(bookingId, paymentReference);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ShipmentTruckResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ShipmentTruckResponse> getBookingById(@PathVariable UUID bookingId) {
        ShipmentTruckResponse booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }
}