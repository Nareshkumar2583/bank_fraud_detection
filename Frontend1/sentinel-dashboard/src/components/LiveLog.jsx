import React, { useEffect, useRef } from 'react';

export default function LiveLog({ transactions = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transactions]);

  // Safety check: handle cases where transactions might be undefined
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>NEURAL LOG STREAM</span>
        <span style={styles.pulse}>● LIVE_FEED</span>
      </div>
      
      <div ref={scrollRef} style={styles.scrollArea}>
        {safeTransactions.slice(0, 15).reverse().map((tx, i) => (
          <div key={i} style={{ marginBottom: '4px', animation: 'fadeIn 0.3s ease' }}>
            <span style={{ color: '#5a6478' }}>[{new Date().toLocaleTimeString()}]</span>
            <span style={{ color: '#00d4ff', marginLeft: '8px' }}>
              {/* FIX: Convert to String before slicing */}
              TXN_{String(tx.transactionId || '0000').slice(-4)}:
            </span>
            <span style={{ 
              color: tx.fraudFlag ? "#ff3b3b" : "#34c759", 
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              {tx.fraudFlag ? " ALERT_THREAT " : " VERIFIED_PKT "}
            </span>
            <span style={{ color: '#888', marginLeft: '8px' }}>
              {( (tx.mlProbability || 0) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "12px", height: "180px", display: "flex", flexDirection: "column", fontFamily: "'Space Mono', monospace" },
  header: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "8px" },
  title: { fontSize: "10px", color: "#00d4ff", fontWeight: "bold", letterSpacing: "1px" },
  pulse: { fontSize: "9px", color: "#5a6478" },
  scrollArea: { flex: 1, overflowY: "auto", fontSize: "10px", lineHeight: "1.4" }
};