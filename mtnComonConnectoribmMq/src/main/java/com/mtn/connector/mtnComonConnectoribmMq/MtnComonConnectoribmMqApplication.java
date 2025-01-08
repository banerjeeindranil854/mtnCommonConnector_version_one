package com.mtn.connector.mtnComonConnectoribmMq;

import com.mtn.publicConnector.config.template.YamlPropertySourceFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.jms.annotation.EnableJms;

@EnableJms
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@ConfigurationProperties(prefix = "yaml")
@PropertySources(
		{@PropertySource(value = "classpath:application.yaml",ignoreResourceNotFound = false,factory = YamlPropertySourceFactory.class),
				@PropertySource(value = "classpath:application.properties" ,ignoreResourceNotFound = false)
		}
)
public class MtnComonConnectoribmMqApplication {

	public static void main(String[] args) {
		SpringApplication.run(MtnComonConnectoribmMqApplication.class, args);
	}
}
