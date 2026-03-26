/**
 * Sentinel AI - Unified API Service Layer
 * Handles Authentication, Real-time Data, Simulation, and ML Inference.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const ML_URL = "http://localhost:8000"; // FastAPI Model Server

export const api = {
  // 1. AUTHENTICATION
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials or server offline");
    return res.json();
  },

  // 2. TRANSACTION MONITORING
  getTransactions: async (token) => {
    const res = await fetch(`${BASE_URL}/transactions`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  // 3. ANALYTICS & KPI STATS
  getStats: async (token) => {
    const res = await fetch(`${BASE_URL}/transactions/stats`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
  },

  // 4. SYSTEM HEALTH & ML DIAGNOSTICS
  getSystemHealth: async (token) => {
    const res = await fetch(`${BASE_URL}/system/health`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    if (!res.ok) throw new Error("Health check endpoint unreachable");
    return res.json();
  },

  toggleSimulation: async (token, start) => {
    const res = await fetch(`${BASE_URL}/transactions/simulate?start=${start}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: "admin", password: "admin123" })
    });
    if (!res.ok) throw new Error("Simulation toggle rejected by server");
    return res.json();
  },

  // Set specific target simulation attack vector
  setScenario: async (token, type) => {
    const res = await fetch(`${BASE_URL}/transactions/scenario?type=${type}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to lock scenario");
    return res.json();
  },

  // 6. MACHINE LEARNING PREDICTION (FastAPI)
  // Ensures data types match Python's Pydantic model exactly
// 6. MACHINE LEARNING PREDICTION (FastAPI)
  getPrediction: async (transaction) => {
    const payload = {
      // Use String for names to match the updated Python Schema
      sender_id: String(transaction.senderId || "Unknown"),
      location: String(transaction.location || "Mumbai"),
      
      // Numbers for the rest
      amount: parseFloat(transaction.amount) || 0.0,
      device_id: String(transaction.deviceId || "DEV_0"),
      transaction_type: String(transaction.transactionType || "UPI"),
      hour: new Date().getHours(),
      txn_frequency: parseInt(transaction.txnFrequency) || 1,
      user_avg_amount: parseFloat(transaction.userAvgAmount) || 0.0,
      amount_vs_avg: parseFloat(transaction.amountVsAvg) || 1.0,
      device_change: transaction.deviceChange ? 1 : 0,
      location_change: transaction.locationChange ? 1 : 0,
      merchant_category: parseInt(transaction.merchantCategory) || 1,
      txn_gap: parseFloat(transaction.txnGap) || 0.0,
      rule_score: parseInt(transaction.ruleScore) || 0
    };

    const res = await fetch(`${ML_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    // Pro-Tip: If you get a 422, log the response body to see the exact field mismatch
    if (!res.ok) {
        const errBody = await res.json();
        console.error("FastAPI 422 Details:", errBody);
        throw new Error("ML Engine prediction failed (Check Console for Details)");
    }
    return res.json(); 
  },

  // 7. DETAILED AUDIT LOGS
  getAuditLogs: async (token) => {
    const res = await fetch(`${BASE_URL}/system/logs`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  },

  // 8. ANALYST → ADMIN MESSAGING
  getMessages: async (token) => {
    const res = await fetch(`${BASE_URL}/messages`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  },

  sendMessage: async (token, from, content) => {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, content }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  clearMessages: async (token) => {
    const res = await fetch(`${BASE_URL}/messages/clear`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to clear messages");
    return res.json();
  },

  // 9. SETTINGS
  getSettings: async (token) => {
    const res = await fetch(`${BASE_URL}/settings`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load settings");
    return res.json();
  },

  saveSettings: async (token, settings) => {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Failed to save settings");
    return res.json();
  },
};