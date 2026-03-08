package com.example.frauddetection.controller;

import com.example.frauddetection.model.Transaction;
import com.example.frauddetection.repository.TransactionRepository;
import com.example.frauddetection.service.DetectionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository repository;
    private final DetectionService detectionService;

    public TransactionController(TransactionRepository repository,
                                 DetectionService detectionService) {

        this.repository = repository;
        this.detectionService = detectionService;
    }
    @PostMapping("/check")
    public Transaction checkFraud(@RequestBody Transaction transaction) {

        int riskScore = detectionService.calculateRiskScore(transaction);

        transaction.setFraudFlag(riskScore >= 70);

        return transaction;
    }

    @PostMapping
    public String saveTransaction(@RequestBody Transaction transaction) {

        // Set status
        transaction.setStatus("SUCCESS");

        // Call DetectionService (this sets riskScore, fraudFlag, and creates alert)
        detectionService.calculateRiskScore(transaction);

        // Save transaction
        repository.save(transaction);

        return "Transaction saved. RiskScore=" +
                transaction.getRiskScore() +
                " Fraud=" +
                transaction.isFraudFlag();
    }
}
