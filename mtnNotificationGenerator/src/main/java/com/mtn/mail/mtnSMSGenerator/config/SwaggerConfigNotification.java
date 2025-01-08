package com.mtn.mail.mtnSMSGenerator.config;

import com.mtn.mail.mtnSMSGenerator.controller.NotificationController;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfigNotification {
    @Bean("notificationConnectorSwagger")
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
                .group("v3")
                .packagesToScan(NotificationController.class.getPackageName())
                .build();
    }
}
