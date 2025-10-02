package com.truckshare.user_service.service;

import com.truckshare.user_service.dto.RegisterRequestdto;
import com.truckshare.user_service.dto.RegisterResponsedto;
import com.truckshare.user_service.entity.User;
import com.truckshare.user_service.exception.UserAlreadyExistsException;
import com.truckshare.user_service.exception.UserNotFoundException;
import com.truckshare.user_service.mapper.UserMapper;
import com.truckshare.user_service.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponsedto registerUser(RegisterRequestdto registerRequestdto){

        //check existing email
        if(userRepository.existsByEmail(registerRequestdto.getEmail())){
            throw new UserAlreadyExistsException("Email already exists!");
        }

        //check for existing phone number
        if(userRepository.existsByPhone(registerRequestdto.getPhone())){
            throw new UserAlreadyExistsException("Phone number already exists!");
        }

        //check for existing user ID
        if(userRepository.existsByUserId(registerRequestdto.getUserId())){
            throw new UserAlreadyExistsException("User ID already exists!");
        }

        // Create new user using mapper
        User user = UserMapper.toUser(registerRequestdto);
        
        // Set password after encoding (mapper doesn't handle password for security)
        user.setPassword(passwordEncoder.encode(registerRequestdto.getPassword()));

        // Save user to database
        User savedUser = userRepository.save(user);

        // Create and return response using mapper
        return UserMapper.toRegisterResponse(savedUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }
}
