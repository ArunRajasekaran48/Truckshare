package com.truckshare.truck_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("/users/{userId}")
    UserResponse getUserByUserId(@PathVariable("userId") String userId);

    @PutMapping("/users/internal/{userId}/driver-availability")
    UserResponse updateDriverAvailability(@PathVariable("userId") String userId,
                                          @RequestParam("status") String status);

    @lombok.Data
    class UserResponse {
        private String userId;
        private String role;
        private String name;
        private String phone;
        private String driverAvailability;
    }
}
