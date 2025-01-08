package com.mtn.publicConnector.validation;


import com.mtn.publicConnector.config.template.YamlPropertySourceFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

@SpringBootApplication
@EntityScan("com.mtn.publicConnector.bean.mtnCommonBean.entity.*")
@ConfigurationProperties(prefix = "yaml")
@PropertySources(
		{@PropertySource(value = "classpath:application.yaml",ignoreResourceNotFound = false,factory = YamlPropertySourceFactory.class),
				@PropertySource(value = "classpath:application.properties" ,ignoreResourceNotFound = false)
		}
)
public class MtnvalidationConnectorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MtnvalidationConnectorApplication.class, args);
	}

}
