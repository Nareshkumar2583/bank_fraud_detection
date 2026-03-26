package com.example.frauddetection.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "sender_id")
    private String senderId = "0";

    @Column(name = "receiver_id")
    private String receiverId = "0";

    private double amount = 0.0;

    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "merchant_name")
    private String merchantName = "Unknown";

    private String location = "Mumbai";

    @Column(name = "device_id")
    private String deviceId = "DEV_0";

    @Column(name = "transaction_type")
    private String transactionType = "PAYMENT";

    // --- FEATURES ---
    @Column(name = "device_change", nullable = false)
    private int deviceChange = 0;

    @Column(name = "location_change", nullable = false)
    private int locationChange = 0;

    @Column(name = "txn_frequency", nullable = false)
    private int txnFrequency = 1;

    @Column(name = "user_avg_amount", nullable = false)
    private double userAvgAmount = 0.0;

    @Column(name = "amount_vs_avg", nullable = false)
    private double amountVsAvg = 1.0;

    @Column(name = "txn_gap")
    private long txnGap = 0;

    // --- RESULTS ---
    @Column(name = "risk_score")
    private int riskScore = 0;   // ✅ ADDED

    @Column(name = "rule_score")
    private int ruleScore = 0;

    @Column(name = "ml_probability")
    private double mlProbability = 0.0;

    @Column(name = "ml_prediction")
    private String mlPrediction = "NORMAL";

    @Column(name = "fraud_flag")
    private boolean fraudFlag = false;

    private String status = "PENDING";

    public Transaction() {}

    // =========================
    // NULL SAFE SETTERS
    // =========================
    public void setTransactionType(String transactionType) {
        this.transactionType = (transactionType == null || transactionType.isEmpty())
                ? "PAYMENT"
                : transactionType;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    // =========================
    // GETTERS & SETTERS
    // =========================
    public Long getTransactionId() { return transactionId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getTransactionType() { return transactionType; }

    public String getMerchantName() { return merchantName; }
    public void setMerchantName(String merchantName) { this.merchantName = merchantName; }

    public int getDeviceChange() { return deviceChange; }
    public void setDeviceChange(int deviceChange) { this.deviceChange = deviceChange; }

    public int getLocationChange() { return locationChange; }
    public void setLocationChange(int locationChange) { this.locationChange = locationChange; }

    public int getTxnFrequency() { return txnFrequency; }
    public void setTxnFrequency(int txnFrequency) { this.txnFrequency = txnFrequency; }

    public double getUserAvgAmount() { return userAvgAmount; }
    public void setUserAvgAmount(double userAvgAmount) { this.userAvgAmount = userAvgAmount; }

    public double getAmountVsAvg() { return amountVsAvg; }
    public void setAmountVsAvg(double amountVsAvg) { this.amountVsAvg = amountVsAvg; }

    public long getTxnGap() { return txnGap; }
    public void setTxnGap(long txnGap) { this.txnGap = txnGap; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public int getRuleScore() { return ruleScore; }
    public void setRuleScore(int ruleScore) { this.ruleScore = ruleScore; }

    public double getMlProbability() { return mlProbability; }
    public void setMlProbability(double mlProbability) { this.mlProbability = mlProbability; }

    public String getMlPrediction() { return mlPrediction; }
    public void setMlPrediction(String mlPrediction) { this.mlPrediction = mlPrediction; }

    public boolean isFraudFlag() { return fraudFlag; }
    public void setFraudFlag(boolean fraudFlag) { this.fraudFlag = fraudFlag; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}