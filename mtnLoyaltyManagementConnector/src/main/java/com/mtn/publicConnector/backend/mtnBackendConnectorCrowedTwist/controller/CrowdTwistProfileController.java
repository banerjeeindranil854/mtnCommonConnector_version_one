package com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.controller;



import com.mtn.publicConnector.backend.mtnBackendConnectorCrowedTwist.connertor.CrowdTwistBackEndSystem;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import com.mtn.publicConnector.outbound.template.MappingTemplateControllerInterface;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class CrowdTwistProfileController implements MappingTemplateControllerInterface<CrowdTwist> {
    private final CrowdTwistBackEndSystem crowdTwistBackEndSystem;
    private final ModelMapper modelMapper;
    public CrowdTwistProfileController(){
      this.crowdTwistBackEndSystem=new CrowdTwistBackEndSystem();
      this.modelMapper = new ModelMapper();
    }



    @Override
    public CrowdTwist getForObject(String header, String url, CrowdTwist body) {

        return modelMapper.map(crowdTwistBackEndSystem.getForObjectWithValue(
                URI.create(StringUtils.isBlank(url)?"http://mtn.com":url),body),
                CrowdTwist.class);
    }

    @Override
    public ResponseEntity<CrowdTwist> getForResponseEntity(String url) {
        return null;
    }
}
