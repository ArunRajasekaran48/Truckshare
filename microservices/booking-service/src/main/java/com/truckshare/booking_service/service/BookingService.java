package com.truckshare.booking_service.service;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.exception.BookingAlreadyPaidException;
import com.truckshare.booking_service.exception.BookingNotFoundException;
import com.truckshare.booking_service.exception.NonSplittableShipmentException;
import com.truckshare.booking_service.mapper.BookingMapper;
import com.truckshare.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShipmentClient shipmentClient;

    public ShipmentTruckResponse createBooking(CreateBookingRequest request) {
        // Save booking with paymentConfirmed default false
        ShipmentTruck booking = BookingMapper.toEntity(request);
        // Validate if it is Non Splittable shipment and throw exception if they are trying to create multiple bookings
        if (!shipmentClient.isSplittable(booking.getShipmentId())) {
            throw new NonSplittableShipmentException("Non-splittable shipments cannot be split into multiple bookings");
        }
        booking.setCreatedAt(Instant.now());
        booking.setPaymentConfirmed(false);
        ShipmentTruck saved = bookingRepository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    public ShipmentTruckResponse acknowledgePayment(
        UUID bookingId, String paymentReference) {
      
        // Load booking or fail
        ShipmentTruck booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found: " + bookingId));

        // Idempotent: if already confirmed, return
        if (Boolean.TRUE.equals(booking.getPaymentConfirmed())) {
            throw new BookingAlreadyPaidException("Payment is already acknowledged for booking: " + bookingId);
        }

        // Call shipment service to finalize allocation and set shipment to BOOKED
        shipmentClient.updateAllocation(
                booking.getShipmentId(),
                booking.getAllocatedWeight(),
                booking.getAllocatedVolume()
        );

        // Mark as paid only after successful remote call
        booking.setPaymentConfirmed(true);
        booking.setPaymentReference(paymentReference);
        booking.setPaymentConfirmedAt(Instant.now());
        ShipmentTruck updated = bookingRepository.save(booking);
        return BookingMapper.toResponse(updated);
    }
}
