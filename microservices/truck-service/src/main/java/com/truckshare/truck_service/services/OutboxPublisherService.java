package com.truckshare.truck_service.services;

import com.truckshare.truck_service.config.RabbitMQConfig;
import com.truckshare.truck_service.models.OutboxEvent;
import com.truckshare.truck_service.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;
    private final RabbitTemplate rabbitTemplate;

    @Scheduled(fixedDelay = 5000) // Run every 5 seconds
    @Transactional
    public void publishOutboxEvents() {
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByProcessedFalseOrderByCreatedAtAsc();

        for (OutboxEvent event : pendingEvents) {
            try {
                String routingKey = determineRoutingKey(event.getEventType());

                if (routingKey != null) {
                    Object payloadObject = deserializePayload(event.getEventType(), event.getPayload());

                    if (payloadObject != null) {
                        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, routingKey, payloadObject);
                        event.setProcessed(true);
                        outboxEventRepository.save(event);
                        log.info("Successfully published outbox event {} for aggregate {}", event.getEventType(),
                                event.getAggregateId());
                    } else {
                        log.warn("Failed to deserialize payload for event type: {}", event.getEventType());
                    }
                } else {
                    log.warn("Unknown event type in outbox: {}", event.getEventType());
                }

            } catch (Exception e) {
                log.error("Failed to publish outbox event {} for aggregate {}", event.getEventType(),
                        event.getAggregateId(), e);
                // Stop to maintain ordering. Retry next cycle.
                break;
            }
        }
    }

    private String determineRoutingKey(String eventType) {
        if ("TruckCapacityUpdatedEvent".equals(eventType)) {
            return RabbitMQConfig.ROUTING_KEY_TRUCK_CAPACITY_UPDATED;
        }
        return null;
    }

    private Object deserializePayload(String eventType, String payload) throws Exception {
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        if ("TruckCapacityUpdatedEvent".equals(eventType)) {
            return mapper.readValue(payload, com.truckshare.truck_service.dto.TruckCapacityUpdatedEvent.class);
        }
        return null;
    }
}
