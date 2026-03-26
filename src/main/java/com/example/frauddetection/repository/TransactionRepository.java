package com.example.frauddetection.repository;

import com.example.frauddetection.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // =========================
    // SAVE TRANSACTION (FULL FIX)
    // =========================
    public Transaction save(Transaction transaction) {

        String sql = "INSERT INTO transactions (" +
                "sender_id, receiver_id, amount, timestamp, location, device_id, merchant_name, transaction_type, " +
                "status, risk_score, fraud_flag, ml_probability, rule_score, txn_gap, " +
                "amount_vs_avg, device_change, location_change, txn_frequency, user_avg_amount" +
                ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                transaction.getSenderId(),
                transaction.getReceiverId(),
                transaction.getAmount(),

                // ✅ FIXED timestamp
                Timestamp.valueOf(transaction.getTimestamp()),

                transaction.getLocation(),
                transaction.getDeviceId(),
                transaction.getMerchantName(),
                transaction.getTransactionType(),
                transaction.getStatus(),

                // ✅ FIXED ORDER (VERY IMPORTANT)
                transaction.getRuleScore(),   // risk_score
                transaction.isFraudFlag(),
                transaction.getMlProbability(),
                transaction.getRuleScore(),
                transaction.getTxnGap(),

                // ✅ NEW FIELDS
                transaction.getAmountVsAvg(),
                transaction.getDeviceChange(),
                transaction.getLocationChange(),
                transaction.getTxnFrequency(),
                transaction.getUserAvgAmount()
        );

        return transaction;
    }

    // =========================
    // FIND BY SENDER ID
    // =========================
    public List<Transaction> findBySenderId(String senderId) {

        String sql = "SELECT * FROM transactions WHERE sender_id = ?";

        return jdbcTemplate.query(sql, getRowMapper(), senderId);
    }

    // =========================
    // FIND ALL
    // =========================
    public List<Transaction> findAll() {

        String sql = "SELECT * FROM transactions ORDER BY timestamp DESC";

        return jdbcTemplate.query(sql, getRowMapper());
    }
    // =========================
    public void deleteAll() {
        String sql = "DELETE FROM transactions";
        jdbcTemplate.update(sql);

        // If you are using H2 or MySQL and want to reset the ID counter:
        // jdbcTemplate.update("ALTER TABLE transactions ALTER COLUMN transaction_id RESTART WITH 1");

        System.out.println("🗑️ Database Purged: All transaction records removed.");
    }

    // =========================
    // COMMON ROW MAPPER (FULL FIX)
    // =========================
    private RowMapper<Transaction> getRowMapper() {
        return (rs, rowNum) -> {

            Transaction t = new Transaction();

            t.setTransactionId(rs.getLong("transaction_id"));
            t.setSenderId(rs.getString("sender_id"));
            t.setReceiverId(rs.getString("receiver_id"));
            t.setAmount(rs.getDouble("amount"));

            // ✅ FIXED timestamp mapping
            t.setTimestamp(rs.getTimestamp("timestamp").toLocalDateTime());

            t.setLocation(rs.getString("location"));
            t.setDeviceId(rs.getString("device_id"));
            t.setMerchantName(rs.getString("merchant_name"));
            t.setTransactionType(rs.getString("transaction_type"));
            t.setStatus(rs.getString("status"));

            // ✅ riskScore mapping (important)
            t.setRiskScore(rs.getInt("risk_score"));

            t.setFraudFlag(rs.getBoolean("fraud_flag"));

            // ML fields
            t.setMlProbability(rs.getDouble("ml_probability"));
            t.setRuleScore(rs.getInt("rule_score"));
            t.setTxnGap(rs.getLong("txn_gap"));

            // ✅ NEW FIELDS
            t.setAmountVsAvg(rs.getDouble("amount_vs_avg"));
            t.setDeviceChange(rs.getInt("device_change"));
            t.setLocationChange(rs.getInt("location_change"));
            t.setTxnFrequency(rs.getInt("txn_frequency"));
            t.setUserAvgAmount(rs.getDouble("user_avg_amount"));

            return t;
        };
    }
}