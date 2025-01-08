package com.mtn.publicConnector.outbound.template;

import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

@Service
public interface NotificationServiceImp<T> {
    public void sendNotification(T object) throws MessagingException;
    public void sendMail(T object) throws MessagingException;

    public void sendSMS(T object);
}
