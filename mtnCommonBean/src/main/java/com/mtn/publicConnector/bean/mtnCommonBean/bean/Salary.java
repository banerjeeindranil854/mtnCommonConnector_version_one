package com.mtn.publicConnector.bean.mtnCommonBean.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
public class Salary {
int userId;
Double amount;
}
