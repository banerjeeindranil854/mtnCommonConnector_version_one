package com.mtn.mail.mtnSMSGenerator.service;

import com.mtn.publicConnector.bean.mtnCommonBean.bean.notification;
import com.mtn.publicConnector.outbound.template.NotificationServiceImp;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
@Slf4j
public class NotificationService implements NotificationServiceImp<notification> {


    @Autowired
    private  JavaMailSender mailSender;


    @Autowired
    private  TemplateEngine templateEngine;

    @Value("${mail.from}")
    private String fromMail;

    @Value("${sms.accountSid}")
    private  String ACCOUNT_SID;
    @Value("${sms.accountToken}")
    private String AUTH_TOKEN;

    @Value("${sms.fromPhoneNumber}")
    private String FROM_PHONE_NUMBER;



    @Override
    public void sendNotification(notification object) throws MessagingException {
        sendMail(object);
        sendSMS(object);
    }
    @Override
    @Async("asyncExecutor")
    public void sendMail(notification object) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

        mimeMessageHelper.setFrom(fromMail);
        mimeMessageHelper.setTo(object.getToEmail());
        mimeMessageHelper.setSubject(object.getSubject());

        if(object.isHTML()) {
            Context context = new Context();
            context.setVariable("content", object.getMessage());
            String processedString = templateEngine.process("template", context);

            mimeMessageHelper.setText(processedString, true);
        } else {
            mimeMessageHelper.setText(object.getMessage(), false);
        }
        mailSender.send(mimeMessage);
    }

    @Override
    @Async("asyncExecutor")
    public void sendSMS(notification object) {
        Twilio.init(this.ACCOUNT_SID, this.AUTH_TOKEN);
        Message.creator(new PhoneNumber(object.getPhoneNumber()), new PhoneNumber(FROM_PHONE_NUMBER),
                object.getMessage()).create();
        log.info("message sent successfully");
    }
}
