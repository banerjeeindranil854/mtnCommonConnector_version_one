package com.mtn.rule.drools.config;

import com.mtn.rule.drools.controller.DroolsRateController;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


    @Configuration
    public class swaggerConfigRule {
        @Bean("ruleConnectorSwagger")
        public GroupedOpenApi apiV1() {
            return GroupedOpenApi.builder()
                    .group("v3")
                    .packagesToScan(DroolsRateController.class.getPackageName())
                    .build();
        }
    }

