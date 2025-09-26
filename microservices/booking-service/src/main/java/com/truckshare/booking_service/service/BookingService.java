package com.truckshare.booking_service.service;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.mapper.BookingMapper;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShipmentClient shipmentClient;

    public ShipmentTruckResponse createBooking(CreateBookingRequest request) {
        // Save booking with paymentConfirmed default false
        ShipmentTruck booking = ShipmentTruck.builder()
                .shipmentId(request.getShipmentId())
                .truckId(request.getTruckId())
                .allocatedWeight(request.getAllocatedWeight())
                .allocatedVolume(request.getAllocatedVolume())
                .build();

        ShipmentTruck saved = bookingRepository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    public ShipmentTruckResponse acknowledgePayment(UUID bookingId) {
        // Load booking or fail
        ShipmentTruck booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        // Idempotent: if already confirmed, return
        if (Boolean.TRUE.equals(booking.getPaymentConfirmed())) {
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
        ShipmentTruck updated = bookingRepository.save(booking);
        return BookingMapper.toResponse(updated);
    }
}
