package com.truckshare.trip_service.services.listener;

import com.truckshare.trip_service.config.RabbitMQConfig;
import com.truckshare.trip_service.dto.BookingConfirmedEvent;
import com.truckshare.trip_service.services.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingConfirmedEventListener {

    private final TripService tripService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = RabbitMQConfig.QUEUE_TRIP_BOOKING_CONFIRMED, durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = RabbitMQConfig.ROUTING_KEY_BOOKING_CONFIRMED
    ))
    public void handleBookingConfirmed(BookingConfirmedEvent event) {
        log.info("Received BookingConfirmedEvent for booking: {}", event.bookingId());
        tripService.createTrip(event.bookingId(), event.shipmentId(), event.truckId());
    }
}
