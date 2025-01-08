package com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.config;

import brave.baggage.BaggageField;
import brave.baggage.CorrelationScopeConfig;
import brave.context.slf4j.MDCScopeDecorator;
import brave.propagation.CurrentTraceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class TraceContextConfig {

    private final BaggageField msisdnTraceField;
    private final BaggageField transactionIdTraceField;
    private final BaggageField sequenceNoTraceField;
    private final BaggageField partnerNameTraceField;

    @Bean
    public CurrentTraceContext.ScopeDecorator mdcScopeDecorator() {
        return MDCScopeDecorator.newBuilder()
            .clear()
            .add(
                CorrelationScopeConfig.SingleCorrelationField.newBuilder(transactionIdTraceField)
                    .flushOnUpdate()
                    .build())
            .add(
                CorrelationScopeConfig.SingleCorrelationField.newBuilder(msisdnTraceField)
                    .flushOnUpdate()
                    .build())
            .add(
                CorrelationScopeConfig.SingleCorrelationField.newBuilder(partnerNameTraceField)
                    .flushOnUpdate()
                    .build())
            .add(
                CorrelationScopeConfig.SingleCorrelationField.newBuilder(sequenceNoTraceField)
                    .flushOnUpdate()
                    .build())
            .build();
    }
}

