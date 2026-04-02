package com.truckshare.truck_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("/users/{userId}")
    UserResponse getUserByUserId(@PathVariable("userId") String userId);

    @lombok.Data
    class UserResponse {
        private String userId;
        private String role;
        private String name;
        private String phone;
    }
}
