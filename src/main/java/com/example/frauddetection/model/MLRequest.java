package com.example.frauddetection.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MLRequest {

    @JsonProperty("sender_id")
    private String sender_id = "0";

    @JsonProperty("device_id")
    private String device_id = "DEV_0";

    @JsonProperty("location")
    private String location = "Mumbai";

    @JsonProperty("transaction_type")
    private String transaction_type = "UPI";

    @JsonProperty("amount")
    private double amount = 0.0;

    @JsonProperty("txn_frequency")
    private int txn_frequency = 1;

    @JsonProperty("user_avg_amount")
    private double user_avg_amount = 1000.0;

    @JsonProperty("amount_vs_avg")
    private double amount_vs_avg = 1.0;

    @JsonProperty("device_change")
    private int device_change = 0;

    @JsonProperty("location_change")
    private int location_change = 0;

    @JsonProperty("txn_gap")
    private double txn_gap = 0.0;

    @JsonProperty("rule_score")
    private int rule_score = 0;

    // GETTERS & SETTERS (same as yours)

    public String getSender_id() { return sender_id; }
    public void setSender_id(String sender_id) {
        this.sender_id = (sender_id == null) ? "0" : sender_id;
    }

    public String getDevice_id() { return device_id; }
    public void setDevice_id(String device_id) {
        this.device_id = (device_id == null) ? "DEV_0" : device_id;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) {
        this.location = (location == null) ? "Mumbai" : location;
    }

    public String getTransaction_type() { return transaction_type; }
    public void setTransaction_type(String transaction_type) {
        this.transaction_type = (transaction_type == null || transaction_type.isEmpty())
                ? "UPI"
                : transaction_type;
    }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public int getTxn_frequency() { return txn_frequency; }
    public void setTxn_frequency(int txn_frequency) { this.txn_frequency = txn_frequency; }

    public double getUser_avg_amount() { return user_avg_amount; }
    public void setUser_avg_amount(double user_avg_amount) { this.user_avg_amount = user_avg_amount; }

    public double getAmount_vs_avg() { return amount_vs_avg; }
    public void setAmount_vs_avg(double amount_vs_avg) { this.amount_vs_avg = amount_vs_avg; }

    public int getDevice_change() { return device_change; }
    public void setDevice_change(int device_change) { this.device_change = device_change; }

    public int getLocation_change() { return location_change; }
    public void setLocation_change(int location_change) { this.location_change = location_change; }

    public double getTxn_gap() { return txn_gap; }
    public void setTxn_gap(double txn_gap) { this.txn_gap = txn_gap; }

    public int getRule_score() { return rule_score; }
    public void setRule_score(int rule_score) { this.rule_score = rule_score; }
}