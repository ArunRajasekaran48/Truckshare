package com.truckshare.trip_service.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "truckshare.exchange";
    public static final String ROUTING_KEY_BOOKING_CONFIRMED = "booking.confirmed";
    public static final String ROUTING_KEY_TRIP_STATUS_UPDATED = "trip.status.updated";
    public static final String QUEUE_TRIP_BOOKING_CONFIRMED = "trip.booking.confirmed.queue";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        converter.setAlwaysConvertToInferredType(true);
        return converter;
    }
}
