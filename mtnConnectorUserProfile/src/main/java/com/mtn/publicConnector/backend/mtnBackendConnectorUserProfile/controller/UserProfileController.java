package com.mtn.publicConnector.backend.mtnBackendConnectorUserProfile.controller;

import com.mtn.publicConnector.backend.mtnBackendConnectorUserProfile.connector.UserProfileBackEndSystem;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.User;
import com.mtn.publicConnector.outbound.template.MappingTemplateControllerInterface;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
public class UserProfileController implements MappingTemplateControllerInterface<User> {
    private final UserProfileBackEndSystem userProfileBackEndSystem;
    private final ModelMapper modelMapper;
    public UserProfileController(){
      this.userProfileBackEndSystem=new UserProfileBackEndSystem();
      this.modelMapper = new ModelMapper();
    }
    @Override
    public User getForObject(String header, String url, User body) {
        return modelMapper.map(userProfileBackEndSystem.getForObject(URI.create(StringUtils.isBlank(url)?"http://mtn.com":url)),User.class);
    }


    @Override
    public ResponseEntity<User> getForResponseEntity(String url) {
        return null;
    }
}
