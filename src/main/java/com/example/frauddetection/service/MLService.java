package com.example.frauddetection.service;

import com.example.frauddetection.model.MLRequest;
import com.example.frauddetection.model.MLResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.http.*;

@Service
public class MLService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://localhost:8000/predict";

    public MLResponse getPrediction(MLRequest requestData) {

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<MLRequest> entity = new HttpEntity<>(requestData, headers);

            MLResponse response = restTemplate.postForObject(
                    FASTAPI_URL,
                    entity,
                    MLResponse.class
            );

            return response != null ? response : getFallback();

        } catch (ResourceAccessException e) {
            System.err.println("❌ ML Server NOT reachable (Check if running on port 8000)");
        } catch (Exception e) {
            System.err.println("❌ ML Engine Error: " + e.getMessage());
        }

        return getFallback();
    }

    private MLResponse getFallback() {
        MLResponse fallback = new MLResponse();
        fallback.setPrediction("NORMAL");
        fallback.setFraud_probability(0.0);
        return fallback;
    }
}