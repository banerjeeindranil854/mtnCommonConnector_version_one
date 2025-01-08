package com.mtn.batch.batchProcessing.config.itemProcessor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mtn.batch.batchProcessing.service.CrowedTwistProcessService;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import com.mtn.publicConnector.bean.mtnCommonBean.util.CreateObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Slf4j
public class CustomItemProcessorCrowedTwist implements ItemProcessor<CrowdTwist , CrowdTwist> {
    @Autowired
    private CrowedTwistProcessService crowedTwistItemProcessor;
    @Override
    public CrowdTwist process(CrowdTwist item) throws Exception {
        ObjectMapper objMapper=new ObjectMapper();
        HttpResponse<String> response = HttpClient.newHttpClient().send(crowedTwistItemProcessor.callingTheConnector(item), HttpResponse.BodyHandlers.ofString());
        return objMapper.readValue(response.body(),CrowdTwist.class);
    }
}

