package com.mtn.publicConnector.outbound.template;

import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;


    @Validated
    @Service
    public interface UrlManagerInterface<T> {
        public String getUrlByKey(@NotBlank String key);
        public T shortenUrl(@NotBlank String url);

    }

