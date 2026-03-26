package com.example.frauddetection.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class SettingsController {

    // In-memory config store — survives for the lifetime of the server process
    private static final Map<String, Object> config = new LinkedHashMap<>();

    static {
        // Defaults
        config.put("autoFreezeThreshold", 90);
        config.put("require2FA", true);
        config.put("emailEscalation", true);
        config.put("mlEndpoint", "http://localhost:8000");
        config.put("pollingInterval", 3000);
    }

    // GET /api/settings — returns current config
    @GetMapping
    public Map<String, Object> getSettings() {
        return new HashMap<>(config);
    }

    // POST /api/settings — updates config with provided key/value pairs
    @PostMapping
    public Map<String, Object> updateSettings(@RequestBody Map<String, Object> updates) {
        config.putAll(updates);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("config", new HashMap<>(config));
        return response;
    }
}
