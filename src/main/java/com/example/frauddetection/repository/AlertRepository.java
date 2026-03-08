//package com.example.frauddetection.repository;
//
//import com.example.frauddetection.model.Alert;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class AlertRepository {
//
//    private final JdbcTemplate jdbcTemplate;
//
//    public AlertRepository(JdbcTemplate jdbcTemplate) {
//        this.jdbcTemplate = jdbcTemplate;
//    }
//
//    public void save(Alert alert) {
//
//        String sql = "INSERT INTO alerts " +
//                "(transaction_id, sender_id, risk_score, fraud_flag, reason, created_at) " +
//                "VALUES (?, ?, ?, ?, ?, ?)";
//
//        jdbcTemplate.update(sql,
//                alert.getTransactionId(),
//                alert.getSenderId(),
//                alert.getRiskScore(),
//                alert.isFraudFlag(),
//                alert.getReason(),
//                alert.getCreatedAt()
//        );
//    }
//}
package com.example.frauddetection.repository;

import com.example.frauddetection.model.Alert;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AlertRepository {

    private final JdbcTemplate jdbcTemplate;

    public AlertRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 🔹 SAVE ALERT
    public void save(Alert alert) {

        String sql = "INSERT INTO alerts " +
                "(transaction_id, sender_id, risk_score, fraud_flag, reason, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                alert.getTransactionId(),
                alert.getSenderId(),
                alert.getRiskScore(),
                alert.isFraudFlag(),
                alert.getReason(),
                alert.getCreatedAt()
        );
    }

    // 🔹 1️⃣ Get All Alerts
    public List<Alert> findAll() {

        String sql = "SELECT * FROM alerts";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Alert alert = new Alert();
            alert.setAlertId(rs.getInt("alert_id"));
            alert.setTransactionId(rs.getLong("transaction_id"));
            alert.setSenderId(rs.getString("sender_id"));
            alert.setRiskScore(rs.getInt("risk_score"));
            alert.setFraudFlag(rs.getBoolean("fraud_flag"));
            alert.setReason(rs.getString("reason"));
            alert.setCreatedAt(rs.getString("created_at"));
            return alert;
        });
    }

    // 🔹 2️⃣ Get High Risk Alerts (risk_score >= 70)
    public List<Alert> findHighRisk() {

        String sql = "SELECT * FROM alerts WHERE risk_score >= 70";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Alert alert = new Alert();
            alert.setAlertId(rs.getInt("alert_id"));
            alert.setTransactionId(rs.getLong("transaction_id"));
            alert.setSenderId(rs.getString("sender_id"));
            alert.setRiskScore(rs.getInt("risk_score"));
            alert.setFraudFlag(rs.getBoolean("fraud_flag"));
            alert.setReason(rs.getString("reason"));
            alert.setCreatedAt(rs.getString("created_at"));
            return alert;
        });
    }

    // 🔹 3️⃣ Filter Alerts by Rule (reason column)
    public List<Alert> findByRule(String rule) {

        String sql = "SELECT * FROM alerts WHERE reason LIKE ?";

        return jdbcTemplate.query(
                sql,
                new Object[]{"%" + rule + "%"},
                (rs, rowNum) -> {
                    Alert alert = new Alert();
                    alert.setAlertId(rs.getInt("alert_id"));
                    alert.setTransactionId(rs.getLong("transaction_id"));
                    alert.setSenderId(rs.getString("sender_id"));
                    alert.setRiskScore(rs.getInt("risk_score"));
                    alert.setFraudFlag(rs.getBoolean("fraud_flag"));
                    alert.setReason(rs.getString("reason"));
                    alert.setCreatedAt(rs.getString("created_at"));
                    return alert;
                }
        );
    }
}
