package com.mtn.publicConnector.bean.mtnCommonBean.util;

import com.mtn.publicConnector.bean.mtnCommonBean.bean.CrowdTwist;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.notification;
import com.mtn.publicConnector.bean.mtnCommonBean.bean.User;

public class CreateObject {
public static User  createUserBeanObject(){
   User user=new User();
    user.setUserId(10);
    user.setAge(10);
    user.setName("Indranil Banerjee");
    user.setEmail("indranil.banerjee@mtn.com");
    user.setGender("male");
    user.setNationality("Indian");
    user.setMobile("983670979");
    return user;
}
    public static notification createNotificationBeanObject(String message, String subject, String toEmail, Boolean isHTML,String phoneNumber){

        return notification.builder().message(message).subject(subject).toEmail(toEmail).isHTML(isHTML).phoneNumber(phoneNumber).build();
}
    public static CrowdTwist createCrowdTwistBeanObject(String thirdPartyId, String id, String tire){
        CrowdTwist crowdTwist=new CrowdTwist();
        crowdTwist.setThird_party_id(thirdPartyId);
        crowdTwist.setTier(tire);
        crowdTwist.setId(id);
        return crowdTwist;
    }
    public static CrowdTwist createCrowdTwistBeanObject(){
        CrowdTwist crowdTwist=new CrowdTwist();
        crowdTwist.setThird_party_id("12345321");
        crowdTwist.setTier("prem");
        crowdTwist.setId("123421");
        return crowdTwist;
    }
    public static com.mtn.publicConnector.bean.mtnCommonBean.entity.User  createUserEntityObject(){
        com.mtn.publicConnector.bean.mtnCommonBean.entity.User user=new com.mtn.publicConnector.bean.mtnCommonBean.entity.User();
        user.setUserId(10);
        user.setAge(10);
        user.setName("Indranil");
        user.setEmail("indranil.banerjee@mtn.com");
        user.setGender("male");
        user.setNationality("Indian");
        user.setMobile("983670979");
        return user;
    }
}
