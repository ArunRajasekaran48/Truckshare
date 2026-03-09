package com.truckshare.shipment_service.service.listener;

import com.truckshare.shipment_service.config.RabbitMQConfig;
import com.truckshare.shipment_service.dto.BookingConfirmedEvent;
import com.truckshare.shipment_service.service.ShipmentService;
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
public class ShipmentEventListener {

    private final ShipmentService shipmentService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "shipment.booking.confirmed.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "booking.confirmed"
    ))
    public void handleBookingConfirmedEvent(BookingConfirmedEvent event) {
        log.info("Received BookingConfirmedEvent for shipment id: {}. Updating allocation: {} weight, {} volume.", 
            event.shipmentId(), event.allocatedWeight(), event.allocatedVolume());
        try {
            shipmentService.updateAllocation(event.shipmentId(), event.allocatedWeight(), event.allocatedVolume());
            log.info("Successfully updated allocation for shipment id: {}", event.shipmentId());
        } catch (Exception e) {
            log.error("Failed to update allocation for shipment id: {} - {}", event.shipmentId(), e.getMessage());
        }
    }
}
