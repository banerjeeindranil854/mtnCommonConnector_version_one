package com.mtn.mail.mtnSMSGenerator;

import com.mtn.publicConnector.config.template.YamlPropertySourceFactory;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.Environment;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@ConfigurationProperties(prefix = "yaml")
@PropertySources(
		{@PropertySource(value = "classpath:application.yaml",ignoreResourceNotFound = false,factory = YamlPropertySourceFactory.class),
				@PropertySource(value = "classpath:application.properties" ,ignoreResourceNotFound = false)
		}
)
@Slf4j
public class MtnNotificationGeneratorApplication extends SpringBootServletInitializer {
	/*@Value("${commonConnector.profile}")
	private String forProfile;*/
	public static void main(String[] args) {
		//log.info("environment name {}",System.getProperty("commonConnector"));
		//System.setProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "prod");
		SpringApplication.run(MtnNotificationGeneratorApplication.class, args);
	}
	/*@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		log.info("environment name {}",System.getProperty("commonConnector"));
		System.setProperty(AbstractEnvironment.ACTIVE_PROFILES_PROPERTY_NAME, "prod");
		super.onStartup(servletContext);
	}*/

}
