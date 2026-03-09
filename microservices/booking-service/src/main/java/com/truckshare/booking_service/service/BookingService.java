package com.truckshare.booking_service.service;

import com.truckshare.booking_service.dto.*;
import com.truckshare.booking_service.dto.enums.ShipmentStatus;
import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.exception.AllocationExceededException;
import com.truckshare.booking_service.exception.BookingAlreadyPaidException;
import com.truckshare.booking_service.exception.BookingNotFoundException;
import com.truckshare.booking_service.exception.NonSplittableShipmentException;
import com.truckshare.booking_service.exception.ShipmentAlreadyBookedException;
import com.truckshare.booking_service.exception.ShipmentOwnershipException;
import com.truckshare.booking_service.mapper.BookingMapper;
import com.truckshare.booking_service.repository.BookingRepository;
import com.truckshare.booking_service.entity.OutboxEvent;
import com.truckshare.booking_service.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ShipmentClient shipmentClient;
    private final TruckClient truckClient;
    private final ObjectMapper objectMapper;

    public ShipmentTruckResponse createBooking(CreateBookingRequest request) {
        ShipmentResponseDto shipment = shipmentClient.getShipmentById(request.getShipmentId());
        validateShipmentOwnership(request, shipment);
        validateShipmentStatus(shipment);
        validateAllocatedAmounts(request, shipment);

        ShipmentTruck booking = BookingMapper.toEntity(request);
        booking.setCreatedAt(Instant.now());
        booking.setPaymentConfirmed(false);
        ShipmentTruck saved = bookingRepository.save(booking);

        BookingCreatedEvent event = new BookingCreatedEvent(
                saved.getId(),
                saved.getShipmentId(),
                saved.getTruckId(),
                saved.getAllocatedWeight(),
                saved.getAllocatedVolume(),
                request.getBusinessUserId()
        );
        
        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                .aggregateType("Booking")
                .aggregateId(saved.getId().toString())
                .eventType("BookingCreatedEvent")
                .payload(objectMapper.writeValueAsString(event))
                .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved BookingCreatedEvent to outbox for booking id: {}", saved.getId());
        } catch (Exception e) {
            log.error("Failed to serialize BookingCreatedEvent", e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }

        return BookingMapper.toResponse(saved);
    }

    private void validateShipmentOwnership(CreateBookingRequest request, ShipmentResponseDto shipment) {
        String bookingBusinessUserId = request.getBusinessUserId();
        if (bookingBusinessUserId == null || shipment.getBusinessUserId() == null) {
            throw new ShipmentOwnershipException("Shipment ownership information is missing.");
        }

        if (!shipment.getBusinessUserId().equals(bookingBusinessUserId)) {
            throw new ShipmentOwnershipException("Shipment does not belong to the requesting business user.");
        }
    }

    private void validateShipmentStatus(ShipmentResponseDto shipment) {
        if (shipment.getStatus() == ShipmentStatus.BOOKED || shipment.getStatus() == ShipmentStatus.CANCELLED) {
            throw new ShipmentAlreadyBookedException("Shipment is not available for booking.");
        }
    }

    private void validateAllocatedAmounts(CreateBookingRequest request, ShipmentResponseDto shipment) {
        double existingAllocatedWeight = shipment.getAllocatedWeight() != null ? shipment.getAllocatedWeight() : 0.0;
        double existingAllocatedVolume = shipment.getAllocatedVolume() != null ? shipment.getAllocatedVolume() : 0.0;

        double requiredWeight = shipment.getRequiredWeight() != null ? shipment.getRequiredWeight() : 0.0;
        double requiredVolume = shipment.getRequiredVolume() != null ? shipment.getRequiredVolume() : 0.0;

        double requestedWeight = request.getAllocatedWeight() != null ? request.getAllocatedWeight() : 0.0;
        double requestedVolume = request.getAllocatedVolume() != null ? request.getAllocatedVolume() : 0.0;

        if (!Boolean.TRUE.equals(shipment.getIsSplit())) {
            if (bookingRepository.existsByShipmentIdAndTruckIdAndBusinessUserId(
                    request.getShipmentId(),
                    request.getTruckId(),
                    request.getBusinessUserId())) {
                throw new ShipmentAlreadyBookedException(
                        "This business user has already booked this shipment with the specified truck.");
            }
            if (existingAllocatedWeight > 0 || existingAllocatedVolume > 0) {
                throw new ShipmentAlreadyBookedException("Non-splittable shipment already has an allocation.");
            }

            if (requestedWeight < requiredWeight || requestedVolume < requiredVolume) {
                throw new NonSplittableShipmentException("Non-splittable shipment must be fully allocated.");
            }

        }

        if (existingAllocatedWeight + requestedWeight > requiredWeight) {
            throw new AllocationExceededException("Allocated weight exceeds the shipment requirement.");
        }

        if (existingAllocatedVolume + requestedVolume > requiredVolume) {
            throw new AllocationExceededException("Allocated volume exceeds the shipment requirement.");
        }

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

        // Publish BookingConfirmedEvent instead of synchronous calls
        // Note: we still need to load truckOwnerId from truckClient for the event if it's not present in booking
        String truckOwnerId = truckClient.getTruckOwnerId(booking.getTruckId());
        
        BookingConfirmedEvent event = new BookingConfirmedEvent(
                booking.getId(),
                booking.getShipmentId(),
                booking.getTruckId(),
                booking.getAllocatedWeight(),
                booking.getAllocatedVolume(),
                truckOwnerId
        );
        
        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                .aggregateType("Booking")
                .aggregateId(booking.getId().toString())
                .eventType("BookingConfirmedEvent")
                .payload(objectMapper.writeValueAsString(event))
                .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved BookingConfirmedEvent to outbox for booking id: {}", booking.getId());
        } catch (Exception e) {
            log.error("Failed to serialize BookingConfirmedEvent", e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }

        // Mark as paid only after saving outbox event
        booking.setPaymentConfirmed(true);
        booking.setPaymentReference(paymentReference);
        booking.setPaymentConfirmedAt(Instant.now());

        ShipmentTruck updated = bookingRepository.save(booking);
        return BookingMapper.toResponse(updated);
    }

    public List<ShipmentTruckResponse> getAllBookings() {
        List<ShipmentTruck> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    public ShipmentTruckResponse getBookingById(UUID bookingId) {
        ShipmentTruck booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found: " + bookingId));
        return BookingMapper.toResponse(booking);
    }
}
