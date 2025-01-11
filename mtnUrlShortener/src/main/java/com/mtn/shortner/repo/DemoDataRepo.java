package com.mtn.shortner.repo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.Url;
import com.mtn.publicConnector.bean.mtnCommonBean.entity.DataDemo;
import com.mtn.publicConnector.bean.mtnCommonBean.util.EncriptedKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class DemoDataRepo {

    @Autowired
    @Qualifier("lettuceRadisTemplate")
    private  RedisTemplate<String, Url> lettuceRadisTemplate;

    public DataDemo create(DataDemo dataDemo)  {
        String encryptedKey;
        try {
            encryptedKey =EncriptedKey.GetKeyObject(dataDemo);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        lettuceRadisTemplate.opsForHash().put(dataDemo.getTransactionId(), encryptedKey, dataDemo);

        log.info(String.format("dataDemo with ID %s saved", dataDemo.getTransactionId()));
        return (DataDemo) lettuceRadisTemplate.opsForHash().get(dataDemo.getTransactionId(), encryptedKey);
    }

    @Caching(
            cacheable = {@Cacheable(value = "dataDemo", key = "#transactionId")}
    )
    public DataDemo get(String key,String hashKey) {
        return (DataDemo) lettuceRadisTemplate.opsForHash().get(key, hashKey);
    }

    public DataDemo CheckDuplicate(DataDemo dataDemo) {
        String encryptedKey;
        try {
            encryptedKey =EncriptedKey.GetKeyObject(dataDemo);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return get(dataDemo.getTransactionId(),encryptedKey);
    }

}
