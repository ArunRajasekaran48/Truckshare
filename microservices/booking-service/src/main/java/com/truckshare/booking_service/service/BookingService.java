package com.truckshare.booking_service.service;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.mapper.BookingMapper;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
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
        booking.setCreatedAt(Instant.now());
        booking.setPaymentConfirmed(false);
        ShipmentTruck saved = bookingRepository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    public ShipmentTruckResponse acknowledgePayment(UUID bookingId, String paymentReference) {
        // Load booking or fail
        ShipmentTruck booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        // Idempotent: if already confirmed, return
        if (booking.getPaymentConfirmed() != null && booking.getPaymentConfirmed()) {
            return BookingMapper.toResponse(booking);
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
