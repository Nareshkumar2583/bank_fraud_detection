package com.example.frauddetection.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;
    private String senderId;
    private String receiverId;
    private double amount;
    private String timestamp;
    private String location;
    private String deviceId;
    private String merchantName;
    private String transactionType;
    private String status;
    private int riskScore;
    private boolean fraudFlag;
    private long txnGap;
    private int ruleScore;
    private double mlProbability;

    // Default constructor
    public Transaction() {
    }

    // Constructor without system fields (status, riskScore, fraudFlag)
    public Transaction(Long transactionId, String senderId, String receiverId,
                       double amount, String timestamp, String location,
                       String deviceId, String merchantName, String transactionType,long txnGap,int ruleScore,double mlProbability) {
        this.transactionId = transactionId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.amount = amount;
        this.timestamp = timestamp;
        this.location = location;
        this.deviceId = deviceId;
        this.merchantName = merchantName;
        this.transactionType = transactionType;
        this.mlProbability=mlProbability;
        this.txnGap=txnGap;
        this.ruleScore=ruleScore;

    }

    // Getters and Setters

    public double getMlProbability() {
        return mlProbability;
    }

    public void setMlProbability(double mlProbability) {
        this.mlProbability = mlProbability;
    }
    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
    public long getTxnGap() {
        return txnGap;
    }

    public void setTxnGap(long txnGap) {
        this.txnGap = txnGap;
    }

    public int getRuleScore() {
        return ruleScore;
    }

    public void setRuleScore(int ruleScore) {
        this.ruleScore = ruleScore;
    }


    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public boolean isFraudFlag() {
        return fraudFlag;
    }

    public void setFraudFlag(boolean fraudFlag) {
        this.fraudFlag = fraudFlag;
    }

}
