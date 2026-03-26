import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../api/sentinelApi";

export function useSentinelData(auth, pollInterval = 3000) {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [mlResult, setMlResult] = useState(null); // NEW: ML Prediction State
  const [connected, setConnected] = useState(false);
  const [newIds, setNewIds] = useState(new Set());
  const prevIds = useRef(new Set());

  const fetchData = useCallback(async () => {
    if (!auth?.token) return;
    try {
      // 1. Fetch Core Data
      const [txs, st, hl] = await Promise.all([
        api.getTransactions(auth.token),
        api.getStats(auth.token),
        api.getSystemHealth(auth.token),
      ]);

      // Enrich transactions with mock dynamic reasons
      const enhancedTxs = (txs || []).map(tx => {
        if (!tx.fraudFlag) return { ...tx, detectionReason: "Pattern: Verified Safe" };
        
        // Dynamic deterministic reasons for fraud based on attributes
        let reason = "Anomalous AI Signature";
        if (tx.amount > 20000) reason = "Velocity: Extreme Value Transfer";
        else if (tx.riskScore > 90) reason = "Known Threat Signature Match";
        else if (tx.location && tx.location.includes("Unknown")) reason = "Geo-Location Proxy Detected";
        else if (tx.amount < 10) reason = "Card Testing Micro-Transaction";
        
        return { ...tx, detectionReason: reason };
      });

      setTransactions(enhancedTxs);
      setStats(st);
      setHealth(hl);
      setConnected(true);

      // 2. Fetch ML Prediction for the most recent transaction
      if (txs && txs.length > 0) {
        const latestTx = txs[0]; 
        try {
          const prediction = await api.getPrediction(latestTx);
          setMlResult(prediction);
        } catch (mlErr) {
          console.error("ML Inference Error:", mlErr);
        }
      }

      // 3. Handle UI Glow Logic
      const currentIds = new Set(enhancedTxs.map(t => t.transactionId));
      const fresh = new Set([...currentIds].filter(id => !prevIds.current.has(id)));
      setNewIds(fresh);
      prevIds.current = currentIds;
      
      setTimeout(() => setNewIds(new Set()), 3000);
    } catch (err) {
      console.error("Global Fetch Error:", err);
      setConnected(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (!auth?.token) return;
    fetchData();
    const t = setInterval(fetchData, pollInterval);
    return () => clearInterval(t);
  }, [fetchData, auth?.token, pollInterval]);

  return { transactions, stats, health, mlResult, connected, newIds, refresh: fetchData };
}