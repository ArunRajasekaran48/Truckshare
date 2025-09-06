package com.truckshare.user_service.repository;

import com.truckshare.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
    
    boolean existsByUserId(String userId);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUserId(String userId);
}
