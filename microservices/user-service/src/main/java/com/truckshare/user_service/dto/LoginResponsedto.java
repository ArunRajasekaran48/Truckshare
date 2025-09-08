package com.truckshare.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponsedto {
    private String token;
    private String tokenType;
}



