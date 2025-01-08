package com.mtn.connector.mtnComonConnectoribmMq.listner;


import com.mtn.connector.mtnComonConnectoribmMq.producer.Dao.AccountDao;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class JMSlistner {

    @JmsListener(destination = "DEV.QUEUE.1", containerFactory = "myFactory")
    public void receiveMessage() {
        System.out.println("Received");
    }

}
