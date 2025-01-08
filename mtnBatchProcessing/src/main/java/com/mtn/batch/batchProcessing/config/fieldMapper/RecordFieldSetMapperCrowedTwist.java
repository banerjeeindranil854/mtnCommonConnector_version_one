package com.mtn.batch.batchProcessing.config.fieldMapper;

import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;

public class RecordFieldSetMapperCrowedTwist implements FieldSetMapper<CrowdTwist> {

    public CrowdTwist mapFieldSet(FieldSet fieldSet) {

        CrowdTwist crowdTwist = new CrowdTwist();
        crowdTwist.setThird_party_id(fieldSet.readString("third_party_id"));
        crowdTwist.setId(fieldSet.readString("id"));
        crowdTwist.setTier(fieldSet.readString("tier"));


        return crowdTwist;

    }
}
