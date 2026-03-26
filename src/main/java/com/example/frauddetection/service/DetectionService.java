package com.example.frauddetection.service;

import com.example.frauddetection.model.MLRequest;
import com.example.frauddetection.model.MLResponse;
import com.example.frauddetection.model.Transaction;
import com.example.frauddetection.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DetectionService {

    private final TransactionRepository repository;
    private final MLService mlInferenceService;
    private final EmailService emailService;

    public DetectionService(TransactionRepository repository, MLService mlInferenceService, EmailService emailService) {
        this.repository = repository;
        this.mlInferenceService = mlInferenceService;
        this.emailService = emailService;
    }

    // =========================
    // MAIN PROCESSING
    // =========================
    public Transaction processTransaction(Transaction transaction) {

        // --- LAYER 1: RULE ENGINE ---
        int ruleScore = calculateRuleScore(transaction);
        transaction.setRuleScore(ruleScore);

        try {
            // --- LAYER 2: ML ENGINE ---
            MLRequest mlRequest = mapToMLRequest(transaction, ruleScore);
            MLResponse mlResponse = mlInferenceService.getPrediction(mlRequest);

            double mlProb = mlResponse.getFraud_probability();

            transaction.setMlProbability(mlProb);
            transaction.setMlPrediction(mlResponse.getPrediction());

            // =========================
            // LAYER 3: HYBRID SCORING
            // =========================

            double ruleProb = ruleScore / 100.0;

            // 🔥 Weighted score
            double finalScore = (0.6 * mlProb) + (0.4 * ruleProb);

            // =========================
            // FINAL DECISION
            // =========================
            boolean isFraud =
                    (finalScore > 0.7) ||
                            (mlProb > 0.85) ||
                            (ruleScore >= 85) ||
                            (mlProb > 0.5 && ruleScore > 50);

            transaction.setFraudFlag(isFraud);

            // =========================
            // STATUS LABEL
            // =========================
            if (finalScore > 0.7) {
                transaction.setStatus("FRAUD");
            } else if (finalScore > 0.4) {
                transaction.setStatus("SUSPICIOUS");
            } else {
                transaction.setStatus("NORMAL");
            }

            // Optional: store hybrid score instead of raw ML
            transaction.setMlProbability(finalScore);

        } catch (Exception e) {
            System.err.println("❌ ML Engine Offline. Using Rules Only.");

            transaction.setMlProbability(0.0);
            transaction.setMlPrediction("SERVICE_UNAVAILABLE");

            boolean isFraud = ruleScore >= 70;
            transaction.setFraudFlag(isFraud);
            transaction.setStatus("RULE_ONLY_CHECK");
        }

        Transaction saved = repository.save(transaction);
        
        // =========================
        // EMERGENCY ALERT ROUTING
        // =========================
        // Trigger Email Alert only for extreme Velocity/Whale transfers caught with high certainty
        if (saved.isFraudFlag() && saved.getAmount() >= 10000 && (saved.getMlProbability() >= 0.85 || saved.getRuleScore() >= 85)) {
            emailService.sendFraudAlertEmail(saved);
        }

        return saved;
    }

    // =========================
    // STRONG RULE ENGINE
    // =========================
    private int calculateRuleScore(Transaction tx) {
        int score = 0;

        // 🔥 Rule 1: Extreme Amount
        if (tx.getAmount() > 100000) score += 80;
        else if (tx.getAmount() > 50000) score += 50;
        else if (tx.getAmount() > 20000) score += 25;

        // 🔥 Rule 2: Night Transactions
        int hour = LocalDateTime.now().getHour();
        if (hour >= 23 || hour <= 5) score += 25;

        // 🔥 Rule 3: High Risk Merchant
        if ("Unknown".equalsIgnoreCase(tx.getMerchantName()) ||
                "Casino".equalsIgnoreCase(tx.getMerchantName())) {
            score += 40;
        }

        // 🔥 Rule 4: Location Change
        if (tx.getLocationChange() == 1) score += 30;

        // 🔥 Rule 5: Device Change
        if (tx.getDeviceChange() == 1) score += 25;

        // 🔥 Rule 6: High Frequency
        if (tx.getTxnFrequency() > 10) score += 40;
        else if (tx.getTxnFrequency() > 5) score += 20;

        // 🔥 Rule 7: Abnormal Amount vs Avg
        if (tx.getAmountVsAvg() > 3) score += 35;
        else if (tx.getAmountVsAvg() > 2) score += 20;

        // 🔥 Rule 8: Short Time Gap
        if (tx.getTxnGap() < 10) score += 25;

        return Math.min(score, 100);
    }

    // =========================
    // ML REQUEST MAPPER
    // =========================
    private MLRequest mapToMLRequest(Transaction tx, int ruleScore) {

        MLRequest req = new MLRequest();

        req.setSender_id(tx.getSenderId());
        req.setDevice_id(tx.getDeviceId());
        req.setLocation(tx.getLocation());
        req.setTransaction_type(tx.getTransactionType());

        req.setAmount(tx.getAmount());
        req.setTxn_frequency(tx.getTxnFrequency());
        req.setUser_avg_amount(tx.getUserAvgAmount());
        req.setAmount_vs_avg(tx.getAmountVsAvg());

        req.setDevice_change(tx.getDeviceChange());
        req.setLocation_change(tx.getLocationChange());
        req.setTxn_gap(tx.getTxnGap());

        req.setRule_score(ruleScore);

        return req;
    }
}