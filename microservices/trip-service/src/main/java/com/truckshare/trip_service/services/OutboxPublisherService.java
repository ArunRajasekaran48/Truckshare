package com.truckshare.trip_service.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.truckshare.trip_service.config.RabbitMQConfig;
import com.truckshare.trip_service.models.OutboxEvent;
import com.truckshare.trip_service.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
public class OutboxPublisherService {

    private final OutboxEventRepository outboxEventRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void publishEvents() {
        List<OutboxEvent> events = outboxEventRepository.findByPublishedAtIsNullOrderByCreatedAtAsc();
        if (events.isEmpty()) {
            return;
        }

        log.info("Found {} unplugged events in outbox. Publishing...", events.size());

        for (OutboxEvent event : events) {
            try {
                // For now, we only have Trip status updates being published from here
                String routingKey = RabbitMQConfig.ROUTING_KEY_TRIP_STATUS_UPDATED;
                
                Object payloadObject = objectMapper.readValue(event.getPayload(), Object.class);
                
                rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, routingKey, payloadObject);
                
                event.setPublishedAt(Instant.now());
                outboxEventRepository.save(event);
                
                log.info("Successfully published outbox event: {} to key: {}", event.getEventType(), routingKey);
            } catch (Exception e) {
                log.error("Failed to publish outbox event: {}", event.getId(), e);
            }
        }
    }
}
