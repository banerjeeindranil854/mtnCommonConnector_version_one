package com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.connertor;


import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import com.mtn.publicConnector.bean.mtnCommonBean.util.CreateObject;
import com.mtn.publicConnector.inbound.template.MappingTemplateBackendInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Map;

public class CrowdTwistBackEndSystem implements MappingTemplateBackendInterface<CrowdTwist> {
    @Autowired
    RestTemplate restTemplate;

    @Override
    public CrowdTwist getForObject(URI url) {
        return null;
    }

    @Override
    public CrowdTwist getForObjectWithValue(URI url, CrowdTwist object) {
        return CreateObject.createCrowdTwistBeanObject(object.getThird_party_id(),
                object.getId(),
                object.getTier());
    }

    @Override
    public ResponseEntity<CrowdTwist> getForResponseEntity(URI url, Class<CrowdTwist> responseType) {
        return null;
    }

    @Override
    public CrowdTwist getForObject(String url, Class<CrowdTwist> responseType, Object... uriVariables) {
        return null;
    }

    @Override
    public CrowdTwist getForObject(String url, Class<CrowdTwist> responseType, Map<String, ?> uriVariables) {
        return null;
    }

    @Override
    public CrowdTwist postForObject(URI url, Object request, Class<CrowdTwist> responseType) {
        return null;
    }

    @Override
    public CrowdTwist postForObject(String url, Object request, Class<CrowdTwist> responseType, Object... uriVariables) {
        return null;
    }

    @Override
    public CrowdTwist postForObject(String url, Object request, Class<CrowdTwist> responseType, Map<String, ?> uriVariables) {
        return null;
    }
}
