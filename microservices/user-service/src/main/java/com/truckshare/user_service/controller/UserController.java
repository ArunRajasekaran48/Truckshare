package com.truckshare.user_service.controller;


import com.truckshare.user_service.dto.RegisterRequestdto;
import com.truckshare.user_service.dto.RegisterResponsedto;
import com.truckshare.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponsedto> registerUser(@Valid @RequestBody RegisterRequestdto registerRequestdto) {
        RegisterResponsedto response = userService.registerUser(registerRequestdto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
