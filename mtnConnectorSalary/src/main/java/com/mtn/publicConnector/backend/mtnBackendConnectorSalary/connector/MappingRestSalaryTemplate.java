package com.mtn.publicConnector.backend.mtnBackendConnectorSalary.connector;

import com.mtn.publicConnector.inbound.template.MappingTemplateBackendInterface;
import com.mtn.publicConnector.bean.mtnCommonBean.entity.Salary;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.util.Map;

public class MappingRestSalaryTemplate implements MappingTemplateBackendInterface<Salary> {

    /**
     * @param url

     * @return
     */
    @Override
    public Salary getForObject(URI url) {
        return null;
    }

    @Override
    public Salary getForObjectWithValue(URI url, Salary object) {
        return null;
    }

    /**
     * @param url
     * @param responseType
     * @return
     */
    @Override
    public ResponseEntity<Salary> getForResponseEntity(URI url, Class<Salary> responseType) {
        return null;
    }

    /**
     * @param url
     * @param responseType
     * @param uriVariables
     * @return
     */
    @Override
    public Salary getForObject(String url, Class<Salary> responseType, Object... uriVariables) {
        return null;
    }

    /**
     * @param url
     * @param responseType
     * @param uriVariables
     * @return
     */
    @Override
    public Salary getForObject(String url, Class<Salary> responseType, Map<String, ?> uriVariables) {
        return null;
    }

    /**
     * @param url
     * @param request
     * @param responseType
     * @return
     */
    @Override
    public Salary postForObject(URI url, Object request, Class<Salary> responseType) {
        return null;
    }

    /**
     * @param url
     * @param request
     * @param responseType
     * @param uriVariables
     * @return
     */
    @Override
    public Salary postForObject(String url, Object request, Class<Salary> responseType, Object... uriVariables) {
        return null;
    }

    /**
     * @param url
     * @param request
     * @param responseType
     * @param uriVariables
     * @return
     */
    @Override
    public Salary postForObject(String url, Object request, Class<Salary> responseType, Map<String, ?> uriVariables) {
        return null;
    }
}
