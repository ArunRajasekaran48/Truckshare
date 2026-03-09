package com.truckshare.matching_service.service.listener;

import com.truckshare.matching_service.config.RabbitMQConfig;
import com.truckshare.matching_service.dto.ShipmentCreatedEvent;
import com.truckshare.matching_service.dto.TruckCapacityUpdatedEvent;
import com.truckshare.matching_service.service.MatchingService;
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
public class MatchingEventListener {

    private final MatchingService matchingService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "matching.shipment.created.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "shipment.created"
    ))
    public void handleShipmentCreatedEvent(ShipmentCreatedEvent event) {
        log.info("Received ShipmentCreatedEvent for shipment id: {}. Finding initial matches...", event.id());
        try {
            var matches = matchingService.findMatches(event.id());
            log.info("Found {} matching trucks for shipment id: {}", matches.getBody().size(), event.id());
        } catch (Exception e) {
            log.warn("Could not find initial matches for shipment id: {} - {}", event.id(), e.getMessage());
        }
    }

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "matching.truck.capacity.updated.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "truck.capacity.updated"
    ))
    public void handleTruckCapacityUpdatedEvent(TruckCapacityUpdatedEvent event) {
        log.info("Received TruckCapacityUpdatedEvent for truck id: {}. New capacity: {}W, {}V.", 
            event.truckId(), event.availableWeight(), event.availableVolume());
        // In a real scenario, this would trigger an evaluation of pending shipments against this newly available capacity
        // and send push notifications to businesses whose shipments match the truck's route.
    }
}
