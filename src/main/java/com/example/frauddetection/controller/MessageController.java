package com.example.frauddetection.controller;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class MessageController {

    // In-memory message store (shared between sessions)
    private static final List<Map<String, Object>> messages = new ArrayList<>();

    // POST /api/messages — Analyst sends a message to Admin
    @PostMapping
    public Map<String, Object> sendMessage(@RequestBody Map<String, String> body) {
        Map<String, Object> msg = new LinkedHashMap<>();
        msg.put("id", System.currentTimeMillis());
        msg.put("from", body.getOrDefault("from", "analyst"));
        msg.put("content", body.getOrDefault("content", ""));
        msg.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy, hh:mm:ss a")));
        msg.put("read", false);
        messages.add(0, msg); // Newest first

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("messageId", msg.get("id"));
        return response;
    }

    // GET /api/messages — Admin fetches all messages
    @GetMapping
    public List<Map<String, Object>> getMessages() {
        return new ArrayList<>(messages);
    }

    // PATCH /api/messages/clear — Admin clears all messages
    @DeleteMapping("/clear")
    public Map<String, Object> clearMessages() {
        messages.clear();
        return Map.of("success", true);
    }
}
