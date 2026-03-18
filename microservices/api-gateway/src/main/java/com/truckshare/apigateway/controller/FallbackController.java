package com.truckshare.apigateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FallbackController {

    @GetMapping("/fallback/serviceUnavailable")
    public Mono<ResponseEntity<Map<String, Object>>> serviceUnavailableFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Service Unavailable");
        response.put("message", "The requested service is temporarily down or slow. Please try again later.");
        response.put("path", "Global Gateway Fallback");

        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
}
