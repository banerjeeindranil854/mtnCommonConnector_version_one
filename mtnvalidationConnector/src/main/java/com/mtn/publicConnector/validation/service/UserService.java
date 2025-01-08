package com.mtn.publicConnector.validation.service;





import com.mtn.publicConnector.bean.mtnCommonBean.entity.User;
import com.mtn.publicConnector.validation.repository.UserRepository;
import com.mtn.publicConnector.validation.dto.UserRequest;

import com.mtn.publicConnector.validation.exception.UserNotFoundException;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {


    @Autowired
    private  UserRepository repository;


    public User saveUser(UserRequest userRequest) {
        User user=new User();
        /*User user = User.
                build(0, userRequest.getName(), userRequest.getEmail(),
                        userRequest.getMobile(), userRequest.getGender(), userRequest.getAge(), userRequest.getNationality());*/
        return repository.save(user);
    }


    public List<User> getALlUsers() {
        return repository.findAll();
    }


    public User getUser(int id) throws UserNotFoundException {
        User user = repository.findByUserId(id);
        if (user != null) {
            return user;
        } else {
            throw new UserNotFoundException("user not found with id : " + id);
        }
    }
}
