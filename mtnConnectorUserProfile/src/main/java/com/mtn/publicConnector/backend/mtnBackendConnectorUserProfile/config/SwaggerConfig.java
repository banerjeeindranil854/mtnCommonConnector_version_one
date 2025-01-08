package com.mtn.publicConnector.backend.mtnBackendConnectorUserProfile.config;


import com.mtn.publicConnector.backend.mtnBackendConnectorUserProfile.controller.UserProfileController;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean("userConnectorSwagger")
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
                .group("v1")
                .packagesToScan(UserProfileController.class.getPackageName())
                .build();
    }
}
