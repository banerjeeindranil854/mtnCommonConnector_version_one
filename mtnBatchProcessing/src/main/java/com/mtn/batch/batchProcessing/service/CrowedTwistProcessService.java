package com.mtn.batch.batchProcessing.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import com.mtn.publicConnector.config.template.YamlPropertySourceFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;

import java.net.URI;
import java.net.http.HttpRequest;

@Configuration
@Slf4j
@ConfigurationProperties(prefix = "yaml")
@PropertySources(
        {@PropertySource(value = "classpath:application.yaml",ignoreResourceNotFound = false,factory = YamlPropertySourceFactory.class),
          @PropertySource(value = "classpath:application.properties" ,ignoreResourceNotFound = false)
        }
)
public class CrowedTwistProcessService {

    @Autowired
    private Environment env;
    private final ObjectMapper objectMapper;


    public CrowedTwistProcessService(){
        this.objectMapper=new ObjectMapper();
    }
    public HttpRequest callingTheConnector(CrowdTwist item) throws JsonProcessingException {

        log.info(env.getProperty("resourceApplicationProperty"));

        String environment = env.getProperty("crowedTwist.url.path");
        String clientId = env.getProperty("client_id");
        String apiKey = env.getProperty("api_key");

        // Generate the URL with the provided properties
        String url = String.format("https://%s-api%s.crowdtwist.com/v2/users/%s?api_key=%s&id_type=third_party_id",
                environment, clientId, item.getThird_party_id(), apiKey);

        log.info("Generated URL: {}", url);

        return HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .DELETE()
                .build();
    }

}
