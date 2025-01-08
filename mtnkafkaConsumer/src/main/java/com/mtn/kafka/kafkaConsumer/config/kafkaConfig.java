package com.mtn.kafka.kafkaConsumer.config;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class kafkaConfig {
    @KafkaListener(topics = "test-topic",
            groupId = "demo_test_consumer_group")

    // Method
    public void
    consume(String message)
    {
        // Print statement
        System.out.println("message = " + message);
    }
}
