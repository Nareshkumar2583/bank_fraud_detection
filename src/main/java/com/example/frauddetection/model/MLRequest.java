package com.example.frauddetection.model;

public class MLRequest {

    public int sender_id;
    public int receiver_id;
    public double amount;
    public int device_id;
    public int location;
    public int transaction_type;
    public int hour;
    public int txn_frequency;
    public double user_avg_amount;
    public double amount_vs_avg;
    public int device_change;
    public int location_change;
    public int merchant_category;
    public long txn_gap;
    public int rule_score;

}