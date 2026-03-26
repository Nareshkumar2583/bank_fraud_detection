package com.example.frauddetection.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MLResponse {

    // Adding JsonProperty ensures Jackson maps the Python "fraud_probability"
    // key correctly to this Java field.
    @JsonProperty("fraud_probability")
    private double fraudProbability;

    @JsonProperty("prediction")
    private String prediction;

    // Getters and Setters
    public double getFraud_probability() { return fraudProbability; }
    public void setFraud_probability(double fraud_probability) { this.fraudProbability = fraud_probability; }

    public String getPrediction() { return prediction; }
    public void setPrediction(String prediction) { this.prediction = prediction; }
}