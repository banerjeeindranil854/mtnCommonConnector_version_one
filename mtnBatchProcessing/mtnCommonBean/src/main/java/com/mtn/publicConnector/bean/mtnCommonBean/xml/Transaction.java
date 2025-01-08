package com.mtn.publicConnector.bean.mtnCommonBean.xml;

import com.mtn.publicConnector.bean.mtnCommonBean.adapter.LocalDateTimeAdapter;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@SuppressWarnings("restriction")
@XmlRootElement(name = "transactionRecord")
public class Transaction {
    @Getter
    @Setter
    private String username;
    @Getter
    @Setter
    private int userId;
    @Getter
    @Setter
    private int age;
    @Getter
    @Setter
    private String postCode;
    @Setter
    private LocalDateTime transactionDate;
    @Getter
    @Setter
    private double amount;

    /* getters and setters for the attributes */

    @XmlJavaTypeAdapter(LocalDateTimeAdapter.class)
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    @Override
    public String toString() {
        return "Transaction [username=" + username + ", userId=" + userId + ", age=" + age + ", postCode=" + postCode + ", transactionDate=" + transactionDate + ", amount=" + amount + "]";
    }
}
