package com.truckshare.notification_service.service;

import com.truckshare.notification_service.config.RabbitMQConfig;
import com.truckshare.notification_service.dto.BookingConfirmedEvent;
import com.truckshare.notification_service.dto.ShipmentCreatedEvent;
import com.truckshare.notification_service.dto.TripStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final EmailService emailService;

    @Value("${app.default.user.email:user@example.com}")
    private String defaultUserEmail;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "notification.shipment.created.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = RabbitMQConfig.ROUTING_KEY_SHIPMENT_CREATED
    ))
    public void handleShipmentCreated(ShipmentCreatedEvent event) {
        log.info("Received ShipmentCreatedEvent for user: {}", event.businessUserId());
        String subject = "Shipment Created Successfully";
        String body = String.format("Hello %s,\n\nYour shipment from %s to %s has been created. Shipment ID: %s",
                event.businessUserId(), event.fromLocation(), event.toLocation(), event.shipmentId());
        
        // In a real app, we would fetch the user's email from user-service
        emailService.sendEmail(defaultUserEmail, subject, body);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "notification.booking.confirmed.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = RabbitMQConfig.ROUTING_KEY_BOOKING_CONFIRMED
    ))
    public void handleBookingConfirmed(BookingConfirmedEvent event) {
        log.info("Received BookingConfirmedEvent for user: {}", event.businessUserId());
        String subject = "Booking Confirmed!";
        String body = String.format("Great news %s!\n\nYour booking for shipment %s has been confirmed at a price of %.2f. Truck ID: %s",
                event.businessUserId(), event.shipmentId(), event.agreedPrice(), event.truckId());
        
        emailService.sendEmail(defaultUserEmail, subject, body);
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "notification.trip.status.updated.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = RabbitMQConfig.ROUTING_KEY_TRIP_STATUS_UPDATED
    ))
    public void handleTripStatusUpdated(TripStatusUpdatedEvent event) {
        log.info("Received TripStatusUpdatedEvent for trip: {} with status: {}", event.tripId(), event.status());
        String subject = "Trip Update: " + event.status();
        String body = String.format("The status of your trip %s has been updated to %s.",
                event.tripId(), event.status());
        
        emailService.sendEmail(defaultUserEmail, subject, body);
    }
}
