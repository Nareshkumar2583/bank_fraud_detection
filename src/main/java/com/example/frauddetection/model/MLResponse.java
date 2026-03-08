package com.example.frauddetection.model;

public class MLResponse {

    private double fraud_probability;
    private String prediction;

    public double getFraud_probability() {
        return fraud_probability;
    }

    public void setFraud_probability(double fraud_probability) {
        this.fraud_probability = fraud_probability;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }
}