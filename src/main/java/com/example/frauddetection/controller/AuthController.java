package com.example.frauddetection.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    private static final Map<String, String> USERS = new HashMap<>();

    static {
        USERS.put("admin", "admin123");
        USERS.put("analyst", "analyst123");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Use .containsKey() and .get() to verify users
        if (USERS.containsKey(username) && USERS.get(username).equals(password)) {
            Map<String, Object> response = new HashMap<>();

            // FIX: Use .put() instead of .add()
            response.put("success", true);
            response.put("username", username);
            response.put("role", username.equalsIgnoreCase("admin") ? "ADMIN" : "ANALYST");
            response.put("token", "mock-jwt-" + UUID.randomUUID());

            return response;
        }

        // Return a 401 Unauthorized if login fails
        throw new RuntimeException("Invalid Credentials");
    }
}