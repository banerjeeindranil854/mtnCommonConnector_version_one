package com.mtn.batch.batchProcessing.config;
import com.mtn.batch.batchProcessing.config.fieldMapper.RecordFieldSetMapperCrowedTwist;
import com.mtn.batch.batchProcessing.config.itemProcessor.CustomItemProcessorCrowedTwist;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import com.mtn.publicConnector.bean.mtnCommonBean.xml.Transaction;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.xml.StaxEventItemWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.WritableResource;
import org.springframework.oxm.Marshaller;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@Profile("mtnSpringBatch")
public class BatchProcessConfigWeb {

    @Value("input/record_crowedTwist.csv")
    private Resource inputCrowedCsv;

    @Value("file:xml/output.xml")
    private WritableResource outputXml;


    public ItemReader<CrowdTwist> itemReader(Resource inputCrowedCsv) throws UnexpectedInputException {
        FlatFileItemReader<CrowdTwist> reader = new FlatFileItemReader<>();
        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        String[] tokens = {"third_party_id", "id", "tier"};
        tokenizer.setNames(tokens);
        reader.setResource(inputCrowedCsv);
        DefaultLineMapper<CrowdTwist> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(new RecordFieldSetMapperCrowedTwist());
        reader.setLinesToSkip(1);
        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean("crowedTwistItemProcessor")
    public ItemProcessor<CrowdTwist, CrowdTwist> itemProcessor() {

        return new CustomItemProcessorCrowedTwist();
    }

    @Bean("crowedTwistMarshaller")
    public Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setClassesToBeBound(CrowdTwist.class);
        return marshaller;
    }
    @Bean("crowdTwistWriter")
    public ItemWriter<CrowdTwist> itemWriter(@Qualifier("crowedTwistMarshaller") Marshaller marshaller) {
        StaxEventItemWriter<CrowdTwist> itemWriter = new StaxEventItemWriter<>();
        itemWriter.setMarshaller(marshaller);
        itemWriter.setRootTagName("crowdTwistRecord");
        itemWriter.setResource(outputXml);
        return itemWriter;
    }
    @Bean(name="CrowedBatchStep")
    protected Step step1(JobRepository jobRepository, PlatformTransactionManager transactionManager, @Qualifier("crowedTwistItemProcessor") ItemProcessor<CrowdTwist,
            CrowdTwist> processor, @Qualifier("crowdTwistWriter") ItemWriter<CrowdTwist> crowdTwistWriter) {
        return new StepBuilder("CrowedBatchStep", jobRepository)
                .<CrowdTwist, CrowdTwist>chunk(10,transactionManager)
                .reader(itemReader(inputCrowedCsv))
                .processor(processor)
                .writer(crowdTwistWriter)
                .build();

    }
    @Bean(name = "crowedBatchJob")
    public Job job(JobRepository jobRepository, @Qualifier("CrowedBatchStep") Step step1) {
        return new JobBuilder("crowedBatchJob", jobRepository)
                .preventRestart()
                .start(step1)
                .build();
    }

}
