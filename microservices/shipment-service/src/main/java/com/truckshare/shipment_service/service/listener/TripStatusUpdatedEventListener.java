package com.truckshare.shipment_service.service.listener;

import com.truckshare.shipment_service.config.RabbitMQConfig;
import com.truckshare.shipment_service.dto.TripStatus;
import com.truckshare.shipment_service.dto.TripStatusUpdatedEvent;
import com.truckshare.shipment_service.entity.Shipment;
import com.truckshare.shipment_service.entity.ShipmentStatus;
import com.truckshare.shipment_service.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class TripStatusUpdatedEventListener {

    private final ShipmentRepository shipmentRepository;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "shipment.trip.status.updated.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "trip.status.updated"
    ))
    @Transactional
    public void handleTripStatusUpdated(TripStatusUpdatedEvent event) {
        log.info("Received TripStatusUpdatedEvent for shipment: {} with status: {}", event.shipmentId(), event.status());
        
        shipmentRepository.findById(event.shipmentId()).ifPresentOrElse(shipment -> {
            ShipmentStatus newStatus = mapToShipmentStatus(event.status());
            if (newStatus != null) {
                shipment.setStatus(newStatus);
                shipmentRepository.save(shipment);
                log.info("Updated shipment: {} status to: {}", event.shipmentId(), newStatus);
            }
        }, () -> log.warn("Shipment not found for status update: {}", event.shipmentId()));
    }

    private ShipmentStatus mapToShipmentStatus(TripStatus tripStatus) {
        return switch (tripStatus) {
            case IN_TRANSIT -> ShipmentStatus.IN_TRANSIT;
            case COMPLETED -> ShipmentStatus.DELIVERED;
            case CANCELLED -> ShipmentStatus.BOOKED; // Or should it go back to MATCHED if cancelled? 
                                                    // For now let's assume it stays BOOKED but needs re-assignment.
            default -> null; // PLANNED and LOADING don't change the shipment state (stays BOOKED)
        };
    }
}
