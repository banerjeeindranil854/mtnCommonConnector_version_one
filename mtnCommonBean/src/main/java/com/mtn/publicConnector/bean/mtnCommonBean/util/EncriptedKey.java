package com.mtn.publicConnector.bean.mtnCommonBean.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.hash.Hashing;
import com.mtn.publicConnector.bean.mtnCommonBean.entity.DataDemo;

import java.nio.charset.Charset;

public class EncriptedKey {
public static String GetKeyString(String field){
  return Hashing.sha256().hashString(field, Charset.defaultCharset()).toString();
}

    public static String GetKeyObject(DataDemo field) throws JsonProcessingException {
        return Hashing.sha256().
                hashString(new ObjectMapper().writer().withDefaultPrettyPrinter()
                        .writeValueAsString(field), Charset.defaultCharset()).toString();
    }

}
