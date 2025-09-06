package com.truckshare.user_service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PasswordEncoderTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testPasswordEncoding() {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        // Verify password is encoded
        assertNotNull(encodedPassword);
        assertNotEquals(rawPassword, encodedPassword);
        
        // Verify password matches
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
        
        // Verify wrong password doesn't match
        assertFalse(passwordEncoder.matches("wrongpassword", encodedPassword));
        
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Encoded Password: " + encodedPassword);
    }

    @Test
    public void testPasswordEncodingConsistency() {
        String rawPassword = "testpassword";
        String encoded1 = passwordEncoder.encode(rawPassword);
        String encoded2 = passwordEncoder.encode(rawPassword);
        
        // Same password should produce different encoded values (due to salt)
        assertNotEquals(encoded1, encoded2);
        
        // But both should match the original password
        assertTrue(passwordEncoder.matches(rawPassword, encoded1));
        assertTrue(passwordEncoder.matches(rawPassword, encoded2));
    }
}

