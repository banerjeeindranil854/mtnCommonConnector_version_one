package com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.config;


import brave.baggage.BaggageField;
import ch.qos.logback.access.tomcat.LogbackValve;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggingConfig {
    private final BaggageField msisdnTraceField;
    private final BaggageField transactionIdTraceField;
    private final BaggageField sequenceNoTraceField;
    private final BaggageField partnerNameTraceField;

    public LoggingConfig(BaggageField msisdnTraceField, BaggageField transactionIdTraceField, BaggageField sequenceNoTraceField, BaggageField partnerNameTraceField) {
        this.msisdnTraceField = msisdnTraceField;
        this.transactionIdTraceField = transactionIdTraceField;
        this.sequenceNoTraceField = sequenceNoTraceField;
        this.partnerNameTraceField = partnerNameTraceField;
    }


    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> accessLogsCustomizer() {
        return factory -> {
            var logbackValve = new LogbackValve();
            logbackValve.setFilename("logback-access.xml");
            logbackValve.setAsyncSupported(true);
            logbackValve.setQuiet(true);
            factory.addContextValves(logbackValve);
        };
    }

}
