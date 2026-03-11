package com.truckshare.booking_service.service;

import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingExpirationService {

    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    /**
     * Background job to clean up unpaid bookings older than 10 minutes.
     * Runs every minute.
     */
    @Scheduled(fixedDelay = 60000) // 1 minute
    public void cleanupExpiredBookings() {
        Instant expiryThreshold = Instant.now().minus(10, ChronoUnit.MINUTES);
        log.info("Running cleanup job. Checking for unpaid bookings created before: {}", expiryThreshold);

        List<ShipmentTruck> expiredBookings = bookingRepository
                .findAllByPaymentConfirmedFalseAndCreatedAtBefore(expiryThreshold);

        if (!expiredBookings.isEmpty()) {
            log.info("Found {} expired unpaid bookings. Starting auto-cleanup...", expiredBookings.size());
            for (ShipmentTruck booking : expiredBookings) {
                try {
                    bookingService.expireBooking(booking);
                } catch (Exception e) {
                    log.error("Failed to auto-expire booking: {}", booking.getId(), e);
                }
            }
        } else {
            log.debug("No expired bookings found at this time.");
        }
    }
}
