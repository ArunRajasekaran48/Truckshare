package com.truckshare.user_service.controller;


import com.truckshare.user_service.dto.RegisterRequestdto;
import com.truckshare.user_service.dto.RegisterResponsedto;
import com.truckshare.user_service.entity.User;
import com.truckshare.user_service.dto.LoginRequestdto;
import com.truckshare.user_service.dto.LoginResponsedto;
import com.truckshare.user_service.security.JwtUtil;
import com.truckshare.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponsedto> registerUser(@Valid @RequestBody RegisterRequestdto registerRequestdto) {
        RegisterResponsedto response = userService.registerUser(registerRequestdto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponsedto> login(@Valid @RequestBody LoginRequestdto loginRequest) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUserId(), loginRequest.getPassword()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new LoginResponsedto(token, "Bearer"));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
}
