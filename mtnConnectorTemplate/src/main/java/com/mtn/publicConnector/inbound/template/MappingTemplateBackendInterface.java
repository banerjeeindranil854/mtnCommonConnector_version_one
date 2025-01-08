package com.mtn.publicConnector.inbound.template;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import java.net.URI;
import java.util.Map;

public interface MappingTemplateBackendInterface<T> {
    // Without parameters
    public  T getForObject(URI url);
    public  T getForObjectWithValue(URI url,T object);
    public  ResponseEntity<T> getForResponseEntity(URI url, Class<T> responseType);
    public T getForObject(String url, Class<T> responseType, Object... uriVariables);
    public T getForObject(String url, Class<T> responseType, Map<String, ?> uriVariables);

    public T postForObject(URI url, @Nullable Object request, Class<T> responseType);
    public T postForObject(String url, @Nullable Object request, Class<T> responseType, Object... uriVariables);
    public T postForObject(String url, @Nullable Object request, Class<T> responseType, Map<String, ?> uriVariables);
}
