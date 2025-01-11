package com.mtn.mail.mtnSMSGenerator.controller;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.notification;
import com.mtn.publicConnector.bean.mtnCommonBean.util.CreateObject;
import com.mtn.publicConnector.outbound.template.NotificationServiceImp;
import com.mtn.publicConnector.outbound.template.MappingTemplateControllerInterface;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class NotificationController implements MappingTemplateControllerInterface<notification> {


    @Autowired
    private  NotificationServiceImp<notification> notificationServiceImp;




    @Override
    public notification getForObject(String header, String url, notification body) {

        try {
            notificationServiceImp.sendMail(body);
            notificationServiceImp.sendSMS(body);
        } catch (MessagingException e) {
            log.error(e.getMessage());
        }
        return CreateObject.createNotificationBeanObject(body.getMessage(),body.getSubject(),body.getToEmail(),body.isHTML(),body.getPhoneNumber());
    }

    @Override
    public ResponseEntity<notification> getForResponseEntity(String url) {
        return null;
    }
}
