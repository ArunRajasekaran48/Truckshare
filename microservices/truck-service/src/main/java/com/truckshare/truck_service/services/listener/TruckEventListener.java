package com.truckshare.truck_service.services.listener;

import com.truckshare.truck_service.config.RabbitMQConfig;
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

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "truck.booking.created.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "booking.proposed"
    ))
    public void handleBookingCreatedEvent(BookingCreatedEvent event) {
        log.info("Received BookingCreatedEvent (proposed) for truck id: {}. Re-evaluating capacity...", event.truckId());
        // Depending on business logic, we could 'reserve' capacity here instead of deducting it fully.
        // For now, we will wait for BookingConfirmedEvent to actually deduct the capacity to avoid inconsistencies.
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "truck.booking.confirmed.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "booking.confirmed"
    ))
    public void handleBookingConfirmedEvent(BookingConfirmedEvent event) {
        log.info("Received BookingConfirmedEvent for truck id: {}. Deducting {} weight and {} volume.", 
            event.truckId(), event.allocatedWeight(), event.allocatedVolume());
        try {
            var updatedTruck = truckService.updateCapacity(event.truckId(), event.allocatedWeight(), event.allocatedVolume());
            // Update status if fully booked
            if (updatedTruck.getAvailableWeight() <= 0 || updatedTruck.getAvailableVolume() <= 0) {
                truckService.updateStatus(event.truckId(), "FULL");
            }
        } catch (Exception e) {
            log.warn("Failed to update capacity for truck id: {} - {}", event.truckId(), e.getMessage());
        }
    }
}
