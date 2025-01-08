package com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.config;


import brave.baggage.BaggageField;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TracingConfig {

    @Bean
    public BaggageField transactionIdTraceField() {
        return BaggageField.create("transactionId");
    }

    @Bean
    public BaggageField msisdnTraceField() {
        return BaggageField.create("msisdn");
    }
    @Bean
    public BaggageField sequenceNoTraceField() {
        return BaggageField.create("sequenceNo");
    }

    @Bean
    public BaggageField partnerNameTraceField() {
        return BaggageField.create("partnerName");
    }
}
