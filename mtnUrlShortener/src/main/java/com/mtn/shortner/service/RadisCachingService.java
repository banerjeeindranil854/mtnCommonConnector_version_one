package com.mtn.shortner.service;

import com.mtn.publicConnector.bean.mtnCommonBean.entity.DataDemo;

import com.mtn.publicConnector.outbound.template.RadisCachingTemplate;
import com.mtn.shortner.repo.DemoDataRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;;import java.util.Objects;

@Component
@Slf4j
public class RadisCachingService implements RadisCachingTemplate<DataDemo> {
    @Autowired
    private DemoDataRepo demoDataRepo;
    @Override
    public DataDemo saveData(DataDemo object) {
        return demoDataRepo.create(object);
    }

    @Override
    public DataDemo getData(String key,String hashKey) {
        return demoDataRepo.get(key,hashKey);
    }

    @Override
    public boolean checkDuplicate(DataDemo object) {
        return Objects.isNull(demoDataRepo.CheckDuplicate(object));
    }


}
