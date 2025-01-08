package com.mtn.batch.batchProcessing.config.itemProcessor;

import com.mtn.publicConnector.bean.mtnCommonBean.xml.Transaction;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.lang.NonNull;

public class CustomItemProcessor implements ItemProcessor<Transaction, Transaction> {

    public Transaction process(Transaction item) {
        System.out.println("Processing..." + item);
        return item;
    }
}
