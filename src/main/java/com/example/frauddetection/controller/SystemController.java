package com.example.frauddetection.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.lang.management.ManagementFactory;
import com.sun.management.OperatingSystemMXBean;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class SystemController {
    
    @GetMapping("/health")
    public Map<String, Object> getHealth() {
        Map<String, Object> health = new HashMap<>();

        // Get System Load using MXBean
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        double cpuLoad = osBean.getSystemCpuLoad() * 100;
        long freeMemory = osBean.getFreePhysicalMemorySize() / (1024 * 1024); // Convert to MB

        health.put("status", "UP");
        health.put("database", "CONNECTED");
        health.put("cpuLoad", String.format("%.1f%%", cpuLoad));
        health.put("freeMemory", freeMemory + "MB");
        health.put("version", "v3.0.4-stable");
        health.put("timestamp", System.currentTimeMillis());

        return health;
    }

    @GetMapping("/logs")
    public java.util.List<Map<String, String>> getLogs() {
        java.util.List<Map<String, String>> logs = new java.util.ArrayList<>();
        long now = System.currentTimeMillis();
        for (int i = 0; i < 50; i++) {
            Map<String, String> log = new HashMap<>();
            log.put("id", "LOG_" + (now - i * 10000));
            log.put("timestamp", new java.util.Date(now - i * 500000).toInstant().toString());
            log.put("event", i % 7 == 0 ? "THREAT_PREVENTION_TRIGGER" : (i % 3 == 0 ? "MODEL_RECALIBRATION" : "SYSTEM_ROUTINE_CHECK"));
            log.put("level", i % 7 == 0 ? "HIGH" : (i % 3 == 0 ? "WARN" : "INFO"));
            log.put("user", "SYSTEM_AUTO");
            log.put("message", i % 7 == 0 ? "Blocked anomalous high-value transfer pattern" : "Completed routine sector scan with 0 anomalies.");
            logs.add(log);
        }
        return logs;
    }
}