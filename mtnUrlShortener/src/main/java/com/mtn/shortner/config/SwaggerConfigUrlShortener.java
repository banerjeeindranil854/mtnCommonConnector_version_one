package com.mtn.shortner.config;

import com.mtn.shortner.controller.UrlController;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfigUrlShortener {
    @Bean("urlShortenerConnectorSwagger")
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
                .group("v2")
                .packagesToScan(UrlController.class.getPackageName())
                .build();
    }

}
