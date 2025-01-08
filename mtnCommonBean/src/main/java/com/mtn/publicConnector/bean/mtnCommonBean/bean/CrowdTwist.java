package com.mtn.publicConnector.bean.mtnCommonBean.bean;

import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@Data
@XmlRootElement(name = "crowdTwistRecord")
public class CrowdTwist {
private String third_party_id;
private String id;
private String tier;
}
