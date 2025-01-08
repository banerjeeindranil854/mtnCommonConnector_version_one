package com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.config;


import com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.controller.CrowdTwistProfileController;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean("loyaltyManagementConnectorSwagger")
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
                .group("v1")
                .packagesToScan(CrowdTwistProfileController.class.getPackageName())
                .build();
    }
}
