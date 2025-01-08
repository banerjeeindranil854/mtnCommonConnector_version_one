package com.mtn.publicConnector.backend.mtnBackendConnectorUserProfile.connector;



import com.mtn.publicConnector.bean.mtnCommonBean.util.CreateObject;
import com.mtn.publicConnector.inbound.template.MappingTemplateBackendInterface;
import com.mtn.publicConnector.bean.mtnCommonBean.entity.User;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Map;

public class UserProfileBackEndSystem implements MappingTemplateBackendInterface<User> {
    @Autowired
    RestTemplate restTemplate;
    /**
     * @param url
     * @return
     */
    @Override
    public User getForObject(URI url) {

        return CreateObject.createUserEntityObject();
    }

    @Override
    public User getForObjectWithValue(URI url, User object) {
        return null;
    }

    /**
     * @param url
     * @param responseType
     * @return
     */
    @Override
    public ResponseEntity<User> getForResponseEntity(URI url, Class<User> responseType) {
        return restTemplate
                .getForEntity(url, User.class);
    }
    /**
     * @param url
     * @param responseType
     * @param uriVariables
     * @return
     */
    @Override
    public User getForObject(String url, Class<User> responseType, Object... uriVariables) {
        return null;
    }
    /**
     * @param url
     * @param responseType
     * @param uriVariables
     * @return
     */
    @Override
    public User getForObject(String url, Class<User> responseType, Map<String, ?> uriVariables) {
        return null;
    }
    /**
     * @param url
     * @param request
     * @param responseType
     * @return
     */
    @Override
    public User postForObject(URI url, Object request, Class<User> responseType) {
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
    public User postForObject(String url, Object request, Class<User> responseType, Object... uriVariables) {
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
    public User postForObject(String url, Object request, Class<User> responseType, Map<String, ?> uriVariables) {
        return null;
    }
}
