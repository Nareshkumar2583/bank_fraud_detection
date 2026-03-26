package com.example.frauddetection.controller;

import com.example.frauddetection.model.Transaction;
import com.example.frauddetection.repository.TransactionRepository;
import com.example.frauddetection.service.DetectionService;
import com.example.frauddetection.simulation.TransactionGenerator;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Sentinel AI - Primary Transaction & Simulation Controller
 * Connects the React Frontend (Port 5173) to the Spring Boot Engine.
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository repository;
    private final DetectionService detectionService;

    public TransactionController(TransactionRepository repository, DetectionService detectionService) {
        this.repository = repository;
        this.detectionService = detectionService;
    }

    /**
     * GET: Fetch all transactions for the "Live Feed" and "Threat Logs"
     */
    @GetMapping
    public List<Transaction> getAllTransactions() {
        // Returns the list sorted by most recent if your repo supports it
        return repository.findAll();
    }

    /**
     * GET: Calculate real-time stats for the KPI StatCards
     */
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        List<Transaction> all = repository.findAll();
        long total = all.size();
        long fraud = all.stream().filter(Transaction::isFraudFlag).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTransactions", total);
        stats.put("fraudCount", fraud);

        // Syncs the "SYSTEM STATUS" Card (RUNNING vs STANDBY)
        stats.put("isSimulating", TransactionGenerator.isSimulationRunning);
        stats.put("systemStatus", TransactionGenerator.isSimulationRunning ? "ACTIVE" : "OPERATIONAL");

        // Calculate Fraud Rate Percentage
        double fraudRate = total == 0 ? 0 : (double) (fraud * 100) / total;
        stats.put("fraudRate", String.format("%.2f", fraudRate));

        return stats;
    }

    /**
     * POST: Toggle the Simulation Engine (START/STOP)
     * FIX: Uses @RequestBody Map to handle React JSON payload { "active": true }
     */
    @PostMapping("/simulate")
    public Map<String, Object> toggleSimulation(
            @RequestParam boolean start, // Reads the ?start=true or ?start=false
            @RequestBody Map<String, String> credentials // Reads the JSON Body
    ) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        // Security Gate: Check if credentials match our Admin
        if ("admin".equals(username) && "admin123".equals(password)) {

            // Update the global simulation state
            TransactionGenerator.isSimulationRunning = start;

            response.put("success", true);
            response.put("isSimulating", TransactionGenerator.isSimulationRunning);
            response.put("message", "ADMIN_AUTHORIZED: Simulation " + (start ? "STARTED" : "STOPPED"));

            System.out.println(">>> [AUTH] Admin granted access. Signal: " + start);
            return response;
        }

        // Access Denied for everyone else
        response.put("success", false);
        response.put("message", "FORBIDDEN: Administrative privileges required.");
        return response;
    }

        // Access Denied for 'analyst' or unknown user
    /**
     * POST: Manual Transaction Entry (for testing specific scenarios)
     */
    @PostMapping
    public Transaction saveTransaction(@RequestBody Transaction transaction) {
        if (transaction.getStatus() == null) transaction.setStatus("SUCCESS");

        // Run ML/Rule detection before saving
        detectionService.processTransaction(transaction);

        return repository.save(transaction);
    }

    /**
     * DELETE: Clear logs (Useful for resetting the demo)
     */
    @DeleteMapping("/clear")
    public Map<String, String> clearDatabase() {
        repository.deleteAll();
        return Map.of("message", "Database Purged Successfully");
    }

    /**
     * POST: Force Simulation Scenario Update
     */
    @PostMapping("/scenario")
    public Map<String, String> setScenario(@RequestParam String type) {
        TransactionGenerator.forceScenario = type.toUpperCase();
        System.out.println(">>> [COMMAND] Simulator locked to scenario: " + type.toUpperCase());
        return Map.of("message", "Simulation scenario updated to " + type.toUpperCase());
    }
}