package com.mtn.publicConnector.bean.mtnCommonBean.bean;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class notification {

    @NonNull
    @JsonAlias(value = "to_email")
    private String toEmail;

    private String subject;

    private String message;

    private String phoneNumber;

    @JsonAlias(value = "html")
    private boolean isHTML;
}
