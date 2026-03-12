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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ShipmentTruckResponse createBooking(CreateBookingRequest request) {
        ShipmentResponseDto shipment = shipmentClient.getShipmentById(request.getShipmentId());
        validateShipmentOwnership(request, shipment);
        validateShipmentStatus(shipment);
        validateAllocatedAmounts(request, shipment);

        ShipmentTruck booking = BookingMapper.toEntity(request);
        booking.setCreatedAt(Instant.now());
        booking.setPaymentConfirmed(false);

        // Synchronously reserve capacity in truck-service
        truckClient.reserveCapacity(request.getTruckId(), request.getAllocatedWeight(), request.getAllocatedVolume(), request.getAllocatedLength());

        ShipmentTruck saved = bookingRepository.save(booking);

        BookingCreatedEvent event = new BookingCreatedEvent(
                saved.getId(),
                saved.getShipmentId(),
                saved.getTruckId(),
                saved.getAllocatedWeight(),
                saved.getAllocatedVolume(),
                request.getAllocatedLength(),
                request.getBusinessUserId());

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
        double requiredLength = shipment.getRequiredLength() != null ? shipment.getRequiredLength() : 0.0;

        double requestedWeight = request.getAllocatedWeight() != null ? request.getAllocatedWeight() : 0.0;
        double requestedVolume = request.getAllocatedVolume() != null ? request.getAllocatedVolume() : 0.0;
        double requestedLength = request.getAllocatedLength() != null ? request.getAllocatedLength() : 0.0;

        if (!Boolean.TRUE.equals(shipment.getIsSplit())) {
            if (bookingRepository.existsByShipmentIdAndTruckIdAndBusinessUserId(
                    shipment.getId(), request.getTruckId(), request.getBusinessUserId())) {
                throw new ShipmentAlreadyBookedException("Booking already exists for this shipment and truck.");
            }

            if (requestedWeight != requiredWeight || requestedVolume != requiredVolume || requestedLength != requiredLength) {
                throw new NonSplittableShipmentException(
                        "For a non-split shipment, allocated weight, volume, and length must exactly match the required amounts.");
            }
        } else {
            double totalAllocatedWeight = shipment.getAllocatedWeight() != null ? shipment.getAllocatedWeight() : 0.0;
            double totalAllocatedVolume = shipment.getAllocatedVolume() != null ? shipment.getAllocatedVolume() : 0.0;
            double totalAllocatedLength = shipment.getAllocatedLength() != null ? shipment.getAllocatedLength() : 0.0;

            if (totalAllocatedWeight + requestedWeight > requiredWeight
                    || totalAllocatedVolume + requestedVolume > requiredVolume
                    || totalAllocatedLength + requestedLength > requiredLength) {
                throw new AllocationExceededException(
                        "Total allocated weight, volume, or length exceeds shipment requirements.");
            }
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
        // Note: we still need to load truckOwnerId from truckClient for the event if
        // it's not present in booking
        String truckOwnerId = truckClient.getTruckOwnerId(booking.getTruckId());

        BookingConfirmedEvent event = new BookingConfirmedEvent(
                booking.getId(),
                booking.getShipmentId(),
                booking.getTruckId(),
                booking.getAllocatedWeight(),
                booking.getAllocatedVolume(),
                booking.getAllocatedLength(),
                truckOwnerId);

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

    /**
     * Cancels a booking that has not yet been payment-confirmed.
     * Publishes BookingCancelledEvent so truck-service restores reserved capacity.
     */
    @Transactional
    public ShipmentTruckResponse cancelBooking(UUID bookingId) {
        ShipmentTruck booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found: " + bookingId));

        if (Boolean.TRUE.equals(booking.getPaymentConfirmed())) {
            throw new BookingAlreadyPaidException("Cannot cancel a payment-confirmed booking: " + bookingId);
        }

        BookingCancelledEvent event = new BookingCancelledEvent(
                booking.getId(),
                booking.getShipmentId(),
                booking.getTruckId(),
                booking.getAllocatedWeight(),
                booking.getAllocatedVolume(),
                booking.getAllocatedLength());

        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Booking")
                    .aggregateId(booking.getId().toString())
                    .eventType("BookingCancelledEvent")
                    .payload(objectMapper.writeValueAsString(event))
                    .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved BookingCancelledEvent to outbox for booking id: {}", bookingId);
        } catch (Exception e) {
            log.error("Failed to serialize BookingCancelledEvent", e);
            throw new RuntimeException("Failed to save cancel event to outbox", e);
        }

        // Synchronously restore capacity in truck-service
        truckClient.restoreCapacity(booking.getTruckId(), booking.getAllocatedWeight(), booking.getAllocatedVolume(), booking.getAllocatedLength());

        bookingRepository.delete(booking);
        return BookingMapper.toResponse(booking);
    }

    /**
     * Automatically expires an unpaid booking.
     * Restores capacity synchronously and notifies other services via Outbox.
     */
    @Transactional
    public void expireBooking(ShipmentTruck booking) {
        log.info("Auto-expiring unpaid booking: {}", booking.getId());

        try {
            // 1. Notify other services that this booking is cancelled due to expiration
            BookingCancelledEvent event = new BookingCancelledEvent(
                    booking.getId(),
                    booking.getShipmentId(),
                    booking.getTruckId(),
                    booking.getAllocatedWeight(),
                    booking.getAllocatedVolume(),
                    booking.getAllocatedLength());

            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType("Booking")
                    .aggregateId(booking.getId().toString())
                    .eventType("BookingCancelledEvent")
                    .payload(objectMapper.writeValueAsString(event))
                    .build();

            outboxEventRepository.save(outboxEvent);
        } catch (Exception e) {
            log.error("Failed to save auto-expiry cancel event to outbox for booking: {}", booking.getId(), e);
            // We continue even if outbox fails, capacity restoration is higher priority
        }

        // 2. Synchronously restore capacity in truck-service
        try {
            truckClient.restoreCapacity(booking.getTruckId(), booking.getAllocatedWeight(),
                    booking.getAllocatedVolume(), booking.getAllocatedLength());
        } catch (Exception e) {
            log.error("Failed to restore capacity synchronously during auto-expiry for booking: {}", booking.getId(),
                    e);
            // This is critical, but we delete the booking anyway to prevent re-processing
        }

        // 3. Delete the zombie booking
        bookingRepository.delete(booking);
        log.info("Successfully expired zombie booking: {}", booking.getId());
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
