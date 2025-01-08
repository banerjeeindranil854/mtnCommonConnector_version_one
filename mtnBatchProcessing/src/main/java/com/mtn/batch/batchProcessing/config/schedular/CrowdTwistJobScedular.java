package com.mtn.batch.batchProcessing.config.schedular;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Objects;

@EnableScheduling
@Configuration
@Slf4j
public class CrowdTwistJobScedular {
    @Autowired
    AnnotationConfigApplicationContext annotationConfigApplicationContext;

    @Scheduled(fixedRate = 5000)
    public void batchSchedular(){
        runJob(annotationConfigApplicationContext, "firstBatchJob");
        runJob(annotationConfigApplicationContext, "crowedBatchJob");
    }
    private static void runJob(AnnotationConfigApplicationContext context, String batchJobName) {
        final JobLauncher jobLauncher = (JobLauncher) context.getBean("jobLauncher");
        final Job job = (Job) context.getBean(batchJobName);

        log.info("Starting the batch job: {}", batchJobName);
        try {
            // To enable multiple execution of a job with the same parameters
            JobParameters jobParameters = new JobParametersBuilder().addString("jobID", String.valueOf(System.currentTimeMillis()))
                    .toJobParameters();
            final JobExecution execution = jobLauncher.run(job, jobParameters);
            log.info("Job Status : {}", execution.getStatus());

        } catch (final Exception e) {
            log.error("Job failed {}", e.getMessage());
        }

    }
}
