package com.mtn.rule.drools.controller;

import com.mtn.rule.drools.domain.Channel;
import com.mtn.rule.drools.domain.ChannelType;
import com.mtn.rule.drools.domain.Participant;
import com.mtn.rule.drools.domain.Rate;
import com.mtn.rule.drools.service.DroolsService;
import org.kie.api.runtime.KieContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


    @RestController
    public class DroolsRateController {

        @Autowired
        private DroolsService bankService;

        @PostMapping("/getrate")
        public ResponseEntity<Rate> getRate(@RequestBody Participant request){
            Rate rate = bankService.getRate(request);
            return new ResponseEntity<>(rate, HttpStatus.OK);
        }

        @PostMapping("/getchannel")
        public ResponseEntity<Channel> getChannel(@RequestHeader("transactionId") String transactionId,
                                                  @RequestHeader("x_api_key") String x_api_key
                                                 ,@RequestBody ChannelType request){
            Channel channel = bankService.getChannel(request);
            return new ResponseEntity<>(channel, HttpStatus.OK);
        }

    }

