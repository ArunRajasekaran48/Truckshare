package com.truckshare.user_service.mapper;

import com.truckshare.user_service.dto.RegisterRequestdto;
import com.truckshare.user_service.dto.RegisterResponsedto;
import com.truckshare.user_service.entity.User;
import com.truckshare.user_service.entity.UserRole;

import java.time.Instant;
import java.util.UUID;

public class UserMapper {

    private UserMapper() {
        // Private constructor to prevent instantiation
    }

    public static User toUser(RegisterRequestdto registerRequestdto) {
        if (registerRequestdto == null) {
            return null;
        }
        User user = new User();
        user.setUserId(registerRequestdto.getUserId());
        user.setEmail(registerRequestdto.getEmail());
        user.setPhone(registerRequestdto.getPhone());
        user.setRole(UserRole.valueOf(registerRequestdto.getRole().toUpperCase()));
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return user;
    }
    public static RegisterResponsedto toRegisterResponse(User user) {
        if (user == null) {
            return null;
        }
        return new RegisterResponsedto(
                user.getId(),
                user.getUserId(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().toString(),
                user.getCreatedAt()
        );
    }
    public static RegisterResponsedto toRegisterResponse(User user, UUID customId) {
        if (user == null) {
            return null;
        }

        return new RegisterResponsedto(
                customId,
                user.getUserId(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().toString(),
                user.getCreatedAt()
        );
    }
    public static User updateUserFromRequest(User user, RegisterRequestdto registerRequestdto) {
        if (user == null || registerRequestdto == null) {
            return user;
        }

        user.setUserId(registerRequestdto.getUserId());
        user.setEmail(registerRequestdto.getEmail());
        user.setPhone(registerRequestdto.getPhone());
        user.setRole(UserRole.valueOf(registerRequestdto.getRole().toUpperCase()));
        user.setUpdatedAt(Instant.now());
        
        return user;
    }
}
