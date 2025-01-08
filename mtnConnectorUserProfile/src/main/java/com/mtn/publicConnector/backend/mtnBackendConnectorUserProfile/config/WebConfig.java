package com.mtn.publicConnector.backend.mtnBackendConnectorUserProfile.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class WebConfig {

    @Bean("userProfileRestTemplateBuilder")
    public  RestTemplateBuilder userProfileRestTemplateBuilder(){
      return new RestTemplateBuilder();
    }
    @Bean
    public RestTemplate restTemplate(@Qualifier("userProfileRestTemplateBuilder") RestTemplateBuilder userProfileRestTemplateBuilder) {
        return userProfileRestTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(3000))
                .setReadTimeout(Duration.ofMillis(3000))
                .build();
    }
}
