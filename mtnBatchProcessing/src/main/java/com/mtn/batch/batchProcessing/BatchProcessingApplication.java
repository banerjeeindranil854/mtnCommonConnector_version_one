package com.mtn.batch.batchProcessing;

import com.mtn.batch.batchProcessing.config.BatchProcessConfigWeb;
import com.mtn.batch.batchProcessing.config.BatchProcessConfigXml;
import com.mtn.batch.batchProcessing.config.schedular.CrowdTwistJobScedular;
import com.mtn.batch.batchProcessing.service.CrowedTwistProcessService;
import com.mtn.publicConnector.config.template.YamlPropertySourceFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Profile;


@Profile("mtnSpringBatch")
@Slf4j
public class BatchProcessingApplication {

	public static void main(String[] args) {
		final AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
		context.getEnvironment().addActiveProfile("mtnSpringBatch");
		context.register(BatchProcessConfigXml.class);
		context.register(BatchProcessConfigWeb.class);
		context.register(CrowedTwistProcessService.class);
		context.register(CrowdTwistJobScedular.class);
		context.register(YamlPropertySourceFactory.class);
		context.refresh();
	}
}
