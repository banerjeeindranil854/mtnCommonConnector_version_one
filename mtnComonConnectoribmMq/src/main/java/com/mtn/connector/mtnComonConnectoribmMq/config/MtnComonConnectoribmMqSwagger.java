package com.mtn.connector.mtnComonConnectoribmMq.config;

import com.mtn.connector.mtnComonConnectoribmMq.MtnComonConnectoribmMqApplication;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MtnComonConnectoribmMqSwagger {
    @Bean("mtnCommonConnector")
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
                .group("v2")
                .packagesToScan(MtnComonConnectoribmMqApplication.class.getPackageName())
                .build();
    }
}
