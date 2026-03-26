package com.example.frauddetection.service;

import com.example.frauddetection.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // required=false prevents application crash if SMTP properties are left empty
    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendFraudAlertEmail(Transaction tx) {
        String subject = "\uD83D\uDEA8 CRITICAL THREAT PREVENTED: Txn ID_" + tx.getTransactionId();
        
        // Generate targeted detection reason for the email
        String detectionReason = "Anomalous AI Signature";
        if (tx.getAmount() > 20000) detectionReason = "Velocity: Extreme Value Transfer";
        else if (tx.getRuleScore() > 90) detectionReason = "Known Threat Signature Match";
        else if (tx.getLocation() != null && tx.getLocation().contains("Unknown")) detectionReason = "Geo-Location Proxy Detected";
        
        String body = String.format(
            "Sentinel AI has successfully intercepted and frozen a critical Level-1 threat.\n\n" +
            "==== INCIDENT REPORT ====\n" +
            "- Transaction ID: %s\n" +
            "- Originating Sender: %s\n" +
            "- Financial Impact: $%.2f\n" +
            "- Threat Confidence Probability: %.1f%%\n" +
            "- Geo-Location: %s\n" +
            "- Detection Reason: %s\n\n" +
            "The account has been placed into AUTO-FREEZE pending immediate operator review.\n" +
            "\nSecurely,\nSentinel AI Engine",
            tx.getTransactionId(), 
            tx.getSenderId(), 
            tx.getAmount(), 
            tx.getMlProbability() * 100.0, 
            tx.getLocation(),
            detectionReason
        );

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo("nareshkumarsitdept@gmail.com"); // Re-routed direct to Admin Inbox
                message.setSubject(subject);
                message.setText(body);
                // Sender overridden by Spring Gmail but good practice to include
                message.setFrom("sentinel-alerts@sentinel.ai"); 

                mailSender.send(message);
                System.out.println(">>> [EMAIL DISPATCHED] SMTP Alert successfully routed to Ops Team.");
            } catch (Exception e) {
                System.err.println(">>> [SMTP ERROR] Could not dispatch email. Invalid Credentials: " + e.getMessage());
            }
        } else {
            System.err.println(">>> [EMAIL MOCKED] High-Risk Alert triggered, but SMTP not configured. Subject: " + subject);
        }
    }
}
