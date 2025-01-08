package com.mtn.publicConnector.validation.repository;


import com.mtn.publicConnector.bean.mtnCommonBean.entity.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserId(int id);
}
