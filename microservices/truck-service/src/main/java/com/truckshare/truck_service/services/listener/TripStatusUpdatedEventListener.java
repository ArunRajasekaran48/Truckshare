package com.truckshare.truck_service.services.listener;

import com.truckshare.truck_service.config.RabbitMQConfig;
import com.truckshare.truck_service.clients.UserClient;
import com.truckshare.truck_service.dto.TripStatus;
import com.truckshare.truck_service.dto.TripStatusUpdatedEvent;
import com.truckshare.truck_service.models.TruckStatus;
import com.truckshare.truck_service.repository.TruckRepository;
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

    private final TruckRepository truckRepository;
    private final UserClient userClient;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "truck.trip.status.updated.queue", durable = "true"),
            exchange = @Exchange(value = RabbitMQConfig.EXCHANGE_NAME, type = "topic"),
            key = "trip.status.updated"
    ))
    @Transactional
    public void handleTripStatusUpdated(TripStatusUpdatedEvent event) {
        log.info("Received TripStatusUpdatedEvent for truck: {} with status: {}", event.truckId(), event.status());
        
        truckRepository.findById(event.truckId()).ifPresentOrElse(truck -> {
            TruckStatus newStatus = mapToTruckStatus(event.status());
            if (newStatus != null) {
                truck.setStatus(newStatus);
                truckRepository.save(truck);
                log.info("Updated truck: {} status to: {}", event.truckId(), newStatus);
            }

            if (truck.getDriverId() != null && !truck.getDriverId().isBlank()) {
                try {
                    String availability = mapToDriverAvailability(event.status());
                    if (availability != null) {
                        userClient.updateDriverAvailability(truck.getDriverId(), availability);
                        log.info("Updated driver: {} availability to: {}", truck.getDriverId(), availability);
                    }
                } catch (Exception e) {
                    log.warn("Failed to update driver availability for driver: {}", truck.getDriverId(), e);
                }
            }
        }, () -> log.warn("Truck not found for status update: {}", event.truckId()));
    }

    private TruckStatus mapToTruckStatus(TripStatus tripStatus) {
        return switch (tripStatus) {
            case IN_TRANSIT -> TruckStatus.IN_TRANSIT;
            case COMPLETED -> TruckStatus.AVAILABLE;
            case CANCELLED -> TruckStatus.AVAILABLE;
            default -> null; // PLANNED and LOADING don't change the truck state (it's already occupied/full)
        };
    }

    private String mapToDriverAvailability(TripStatus tripStatus) {
        return switch (tripStatus) {
            case IN_TRANSIT, LOADING, PLANNED -> "ON_TRIP";
            case COMPLETED, CANCELLED -> "AVAILABLE";
        };
    }
}
