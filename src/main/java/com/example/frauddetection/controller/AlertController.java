package com.example.frauddetection.controller;

import com.example.frauddetection.model.Alert;
import com.example.frauddetection.service.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    // 1️⃣ GET /api/alerts
    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    // 2️⃣ GET /api/alerts/high-risk
    @GetMapping("/high-risk")
    public List<Alert> getHighRiskAlerts() {
        return alertService.getHighRiskAlerts();
    }

    // 3️⃣ GET /api/alerts/by-rule/{rule}
    @GetMapping("/by-rule/{rule}")
    public List<Alert> getAlertsByRule(@PathVariable String rule) {
        return alertService.getAlertsByRule(rule);
    }
}
