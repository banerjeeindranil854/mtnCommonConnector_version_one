package com.mtn.shortner.service;

import com.mtn.publicConnector.bean.mtnCommonBean.bean.Url;
import com.mtn.publicConnector.outbound.template.UrlManagerInterface;
import com.mtn.publicConnector.bean.mtnCommonBean.util.EncriptedKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class UrlService implements UrlManagerInterface<Url> {
    @Autowired
    @Qualifier("jacksonRedisTemplate")
    private RedisTemplate<String, Url> jacksonRedisTemplate;




    @Override
    public String getUrlByKey(String key) {
        Url url = jacksonRedisTemplate.opsForValue().get(key);
        assert url != null;
        return url.getUrl();
    }

    @Override
    public Url shortenUrl(String url) {
        // generating murmur3 based hash key as short URL
        String key = EncriptedKey.GetKeyString(url);

        Url shortUrlEntry = Url.builder().key(key).createdAt(LocalDateTime.now()).url(url).build();

        //store in redis
        jacksonRedisTemplate.opsForValue().set(key, shortUrlEntry, 36000L, TimeUnit.SECONDS);

        return shortUrlEntry;
    }



}
