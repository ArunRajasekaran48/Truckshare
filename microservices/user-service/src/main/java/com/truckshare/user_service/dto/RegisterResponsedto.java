package com.truckshare.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
public class RegisterResponsedto {
    private UUID id;
    private String userId;
    private String email;
    private String phone;
    private String role;
    private Instant createdAt;
}
