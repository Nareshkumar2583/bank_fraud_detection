package com.example.frauddetection.repository;

import com.example.frauddetection.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // SAVE TRANSACTION
    public void save(Transaction transaction) {

        String sql = "INSERT INTO transactions " +
                "(transaction_id, sender_id, receiver_id, amount, timestamp, location, device_id, merchant_name, transaction_type, status, risk_score, fraud_flag, ml_probability, rule_score, txn_gap) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                transaction.getTransactionId(),
                transaction.getSenderId(),
                transaction.getReceiverId(),
                transaction.getAmount(),
                transaction.getTimestamp(),
                transaction.getLocation(),
                transaction.getDeviceId(),
                transaction.getMerchantName(),
                transaction.getTransactionType(),
                transaction.getStatus(),
                transaction.getRiskScore(),
                transaction.isFraudFlag(),
                transaction.getMlProbability(),
                transaction.getRuleScore(),   // NEW FIELD
                transaction.getTxnGap()       // NEW FIELD
        );
    }

    // FIND USER TRANSACTIONS
    public List<Transaction> findBySenderId(String senderId) {

        String sql = "SELECT * FROM transactions WHERE sender_id = ?";

        RowMapper<Transaction> mapper = (rs, rowNum) -> {

            Transaction t = new Transaction();

            t.setTransactionId(rs.getLong("transaction_id"));
            t.setSenderId(rs.getString("sender_id"));
            t.setReceiverId(rs.getString("receiver_id"));
            t.setAmount(rs.getDouble("amount"));
            t.setTimestamp(rs.getString("timestamp"));
            t.setLocation(rs.getString("location"));
            t.setDeviceId(rs.getString("device_id"));
            t.setMerchantName(rs.getString("merchant_name"));
            t.setTransactionType(rs.getString("transaction_type"));
            t.setStatus(rs.getString("status"));
            t.setRiskScore(rs.getInt("risk_score"));
            t.setFraudFlag(rs.getBoolean("fraud_flag"));

            // ML fields
            t.setMlProbability(rs.getDouble("ml_probability"));
            t.setRuleScore(rs.getInt("rule_score"));
            t.setTxnGap(rs.getLong("txn_gap"));

            return t;
        };

        return jdbcTemplate.query(sql, mapper, senderId);
    }
}