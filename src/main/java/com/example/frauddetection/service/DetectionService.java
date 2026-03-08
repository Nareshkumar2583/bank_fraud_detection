package com.example.frauddetection.service;

import com.example.frauddetection.model.MLRequest;
import com.example.frauddetection.model.MLResponse;
import com.example.frauddetection.model.Transaction;
import com.example.frauddetection.repository.TransactionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DetectionService {

    private final TransactionRepository repository;
    private final AlertService alertService;

    public DetectionService(TransactionRepository repository,
                            AlertService alertService) {
        this.repository = repository;
        this.alertService = alertService;
    }

    public int calculateRiskScore(Transaction transaction) {

        int score = 0;
        StringBuilder reason = new StringBuilder();

        // RULE 1: High value
        if (transaction.getAmount() > 50000) {
            score += 50;
            reason.append("High value transaction; ");
            System.out.println("RULE TRIGGERED: High value transaction");
        }

        // RULE 2: Suspicious merchant
        if ("Unknown".equalsIgnoreCase(transaction.getMerchantName())) {
            score += 30;
            reason.append("Suspicious merchant; ");
            System.out.println("RULE TRIGGERED: Suspicious merchant");
        }

        // RULE 3: Odd hours
        try {

            LocalDateTime time = LocalDateTime.parse(transaction.getTimestamp());
            int hour = time.getHour();

            if (hour >= 0 && hour <= 5) {
                score += 20;
                reason.append("Odd hour transaction; ");
                System.out.println("RULE TRIGGERED: Odd hour transaction");
            }

        } catch (Exception e) {
            System.out.println("Timestamp format issue");
        }

        // Get user transaction history
        List<Transaction> userTransactions =
                repository.findBySenderId(transaction.getSenderId());

        // RULE 4: Rapid transactions
        if (userTransactions.size() >= 3) {
            score += 20;
            reason.append("Rapid multiple transactions; ");
            System.out.println("RULE TRIGGERED: Rapid multiple transactions");
        }

        // RULE 5: Location mismatch
        if (!userTransactions.isEmpty()) {

            String lastLocation =
                    userTransactions.get(userTransactions.size() - 1).getLocation();

            if (!lastLocation.equals(transaction.getLocation())) {
                score += 25;
                reason.append("Location mismatch; ");
                System.out.println("RULE TRIGGERED: Location mismatch");
            }
        }

        // RULE 6: New location
        score += checkNewLocation(transaction, userTransactions, reason);

        // Calculate txn_gap
        long gap = 30;

        if (!userTransactions.isEmpty()) {

            Transaction lastTxn =
                    userTransactions.get(userTransactions.size() - 1);

            try {

                LocalDateTime lastTime =
                        LocalDateTime.parse(lastTxn.getTimestamp());

                LocalDateTime currentTime =
                        LocalDateTime.parse(transaction.getTimestamp());

                gap = Duration.between(lastTime, currentTime).getSeconds();

            } catch (Exception e) {
                gap = 30;
            }
        }

        transaction.setTxnGap(gap);

        // set rule score for ML
        transaction.setRuleScore(score);

        // call ML model
        double mlProbability = getMLProbability(transaction);

        transaction.setMlProbability(mlProbability);

        System.out.println("ML Probability: " + mlProbability);

        // final fraud decision
        boolean fraudDetected = (score >= 70 || mlProbability >= 0.40);

        transaction.setFraudFlag(fraudDetected);

        if (fraudDetected) {

            alertService.createAlert(transaction, reason.toString());

            System.out.println("ALERT CREATED for transaction: "
                    + transaction.getTransactionId());
        }

        return score;
    }


    private int checkNewLocation(Transaction transaction,
                                 List<Transaction> userTransactions,
                                 StringBuilder reason) {

        boolean knownLocation = userTransactions.stream()
                .anyMatch(tx -> tx.getLocation()
                        .equalsIgnoreCase(transaction.getLocation()));

        if (!knownLocation && !userTransactions.isEmpty()) {
            reason.append("New location detected; ");
            System.out.println("RULE TRIGGERED: New location detected");
            return 20;
        }

        return 0;
    }


    public double getMLProbability(Transaction transaction) {

        RestTemplate restTemplate = new RestTemplate();

        String url = "http://localhost:8000/predict";

        MLRequest request = new MLRequest();

        request.sender_id =
                Integer.parseInt(transaction.getSenderId().replace("USER",""));

        request.amount = transaction.getAmount();

        request.device_id = 1;

        request.location = 1;

        request.transaction_type = 1;

        request.hour =
                LocalDateTime.parse(transaction.getTimestamp()).getHour();

        request.txn_frequency = 5;

        request.user_avg_amount = 5000;

        request.amount_vs_avg =
                transaction.getAmount() / 5000;

        request.device_change = 0;

        request.location_change = 0;

        request.merchant_category = 1;

        request.txn_gap = transaction.getTxnGap();

        request.rule_score = transaction.getRuleScore();

        try {

            ResponseEntity<MLResponse> response =
                    restTemplate.postForEntity(url, request, MLResponse.class);

            return response.getBody().getFraud_probability();

        } catch(Exception e) {

            System.out.println("ML API error: " + e.getMessage());
            return 0.0;
        }
    }
}