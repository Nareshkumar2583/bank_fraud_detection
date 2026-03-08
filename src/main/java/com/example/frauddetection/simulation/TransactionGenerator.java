package com.example.frauddetection.simulation;

import com.example.frauddetection.model.Transaction;
import com.example.frauddetection.repository.TransactionRepository;
import com.example.frauddetection.service.DetectionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Component
public class TransactionGenerator implements CommandLineRunner {

    private final DetectionService detectionService;
    private final TransactionRepository repository;

    public TransactionGenerator(DetectionService detectionService,
                                TransactionRepository repository) {
        this.detectionService = detectionService;
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {

        Random random = new Random();

        String[] users = {"USER001", "USER002", "USER003", "USER004"};

        String[] locations = {
                "Hyderabad", "Delhi", "Mumbai",
                "Chennai", "Bangalore"
        };

        String[] normalMerchants = {
                "Amazon", "Flipkart", "Myntra",
                "Swiggy", "Zomato", "Paytm",
                "PhonePe", "GooglePay", "Uber"
        };

        String[] suspiciousMerchants = {
                "Unknown", "FakeShop", "FraudStore"
        };

        String[] types = {"ONLINE", "UPI", "CARD", "NETBANKING"};

        while (true) {

            Transaction txn = new Transaction();


            // Sender & Receiver
            txn.setSenderId(users[random.nextInt(users.length)]);
            txn.setReceiverId(users[random.nextInt(users.length)]);

            // 💰 Amount Logic (High fraud chance)
            double amount;
            if (random.nextInt(10) > 7) {
                amount = 80000 + random.nextInt(50000); // Fraud
            } else {
                amount = 1000 + random.nextInt(10000); // Normal
            }
            txn.setAmount(amount);

            // ⏰ Timestamp
            txn.setTimestamp(LocalDateTime.now().toString());

            // 📍 Location
            txn.setLocation(locations[random.nextInt(locations.length)]);

            // 📱 Device
            txn.setDeviceId("DEV" + random.nextInt(1000));

            // 🛒 Merchant (20% suspicious)
            if (random.nextInt(10) > 7) {
                txn.setMerchantName(
                        suspiciousMerchants[random.nextInt(suspiciousMerchants.length)]
                );
            } else {
                txn.setMerchantName(
                        normalMerchants[random.nextInt(normalMerchants.length)]
                );
            }

            // 💳 Transaction Type
            txn.setTransactionType(types[random.nextInt(types.length)]);

            txn.setStatus("SUCCESS");

            // 🔍 Run Fraud Detection
            detectionService.calculateRiskScore(txn);

            // 💾 Save to Database
            repository.save(txn);

            // 🖨 Print Output
            System.out.println("\nGenerated Transaction:");
            System.out.println("ID: " + txn.getTransactionId());
            System.out.println("Sender: " + txn.getSenderId());
            System.out.println("Merchant: " + txn.getMerchantName());
            System.out.println("Amount: ₹" + txn.getAmount());
            System.out.println("Location: " + txn.getLocation());
            System.out.println("RiskScore: " + txn.getRiskScore());
            System.out.println("Fraud: " + txn.isFraudFlag());

            Thread.sleep(3000);
        }
    }
}