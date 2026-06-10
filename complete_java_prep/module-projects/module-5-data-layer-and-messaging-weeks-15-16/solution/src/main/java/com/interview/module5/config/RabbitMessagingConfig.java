package com.interview.module5.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMessagingConfig {

    @Bean
    Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    DirectExchange orderExchange(@Value("${module5.messaging.exchange}") String exchange) {
        return new DirectExchange(exchange);
    }

    @Bean
    Queue orderQueue(@Value("${module5.messaging.queue}") String queue,
                     @Value("${module5.messaging.dlq}") String dlq,
                     @Value("${module5.messaging.exchange}") String exchange) {
        return QueueBuilder.durable(queue)
            .withArgument("x-dead-letter-exchange", exchange)
            .withArgument("x-dead-letter-routing-key", dlq)
            .build();
    }

    @Bean
    Queue orderDlq(@Value("${module5.messaging.dlq}") String dlq) {
        return QueueBuilder.durable(dlq).build();
    }

    @Bean
    Binding orderBinding(Queue orderQueue,
                         DirectExchange orderExchange,
                         @Value("${module5.messaging.routing-key}") String routingKey) {
        return BindingBuilder.bind(orderQueue).to(orderExchange).with(routingKey);
    }

    @Bean
    Binding dlqBinding(Queue orderDlq,
                       DirectExchange orderExchange,
                       @Value("${module5.messaging.dlq}") String dlq) {
        return BindingBuilder.bind(orderDlq).to(orderExchange).with(dlq);
    }
}
