package com.mtn.rule.drools.service;

import com.mtn.rule.drools.domain.Channel;
import com.mtn.rule.drools.domain.ChannelType;
import com.mtn.rule.drools.domain.Participant;
import com.mtn.rule.drools.domain.Rate;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DroolsService {

    @Autowired
    private KieContainer kieContainer;

    public Rate getRate(Participant applicantRequest) {
        Rate rate = new Rate();
        KieSession kieSession = kieContainer.newKieSession();
        kieSession.setGlobal("rate", rate);
        kieSession.insert(applicantRequest);
        kieSession.fireAllRules();
        kieSession.dispose();
        return rate;
    }

    public Channel getChannel(ChannelType channelType) {
        Channel channel = new Channel();
        KieSession kieSession = kieContainer.newKieSession();
        kieSession.setGlobal("channel", channel);
        kieSession.insert(channelType);
        kieSession.fireAllRules();
        kieSession.dispose();
        return channel;
    }

}
