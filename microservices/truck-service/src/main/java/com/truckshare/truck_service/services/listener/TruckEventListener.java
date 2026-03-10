package com.truckshare.truck_service.services.listener;

import com.truckshare.truck_service.config.RabbitMQConfig;
import com.truckshare.truck_service.dto.BookingCancelledEvent;
import com.truckshare.truck_service.dto.BookingConfirmedEvent;
import com.truckshare.truck_service.dto.BookingCreatedEvent;
import com.truckshare.truck_service.services.TruckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TruckEventListener {

    private final TruckService truckService;

    /**
     * When a booking is PROPOSED, we immediately reserve (deduct) truck capacity.
     * This prevents overbooking between proposal and payment confirmation.
     */
    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "truck.booking.created.queue", durable = "true"), exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"), key = "booking.proposed"))
    public void handleBookingCreatedEvent(BookingCreatedEvent event) {
        log.info(
                "BookingProposed Event Received: Booking {} for truck id: {}. Capacity was already reserved synchronously.",
                event.bookingId(), event.truckId());
        // No action needed here as capacity is reserved synchronously in BookingService
    }

    /**
     * When booking is CONFIRMED (payment acknowledged), the capacity is already
     * reserved.
     * No further deduction needed.
     */
    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "truck.booking.confirmed.queue", durable = "true"), exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"), key = "booking.confirmed"))
    public void handleBookingConfirmedEvent(BookingConfirmedEvent event) {
        log.info(
                "BookingConfirmed Event Received: Booking {} for truck {} is now fully confirmed. Capacity remains reserved.",
                event.bookingId(), event.truckId());
    }

    /**
     * When a booking is CANCELLED, capacity is restored synchronously by
     * BookingService.
     * We just log the event for auditing/debugging here.
     */
    @RabbitListener(bindings = @QueueBinding(value = @Queue(value = "truck.booking.cancelled.queue", durable = "true"), exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"), key = "booking.cancelled"))
    public void handleBookingCancelledEvent(BookingCancelledEvent event) {
        log.info(
                "BookingCancelled Event Received: Booking {} for truck id: {}. Capacity was already restored synchronously.",
                event.bookingId(), event.truckId());
    }
}
