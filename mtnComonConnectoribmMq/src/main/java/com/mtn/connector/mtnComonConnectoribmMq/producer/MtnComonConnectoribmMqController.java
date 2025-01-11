package com.mtn.connector.mtnComonConnectoribmMq.producer;


import com.mtn.connector.mtnComonConnectoribmMq.producer.Dao.AccountDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping

public final class MtnComonConnectoribmMqController {
    @Autowired
    public JmsTemplate jmsTemplate;

    @RequestMapping(value = "/send", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<AccountDao> send() {

        AccountDao accountDao = new AccountDao();
        accountDao.setName("1ndra");
        accountDao.setValue(12);

        jmsTemplate.
                convertAndSend
                        ("DEV.QUEUE.1", accountDao);

        return ResponseEntity.ok(accountDao);
    }
}

