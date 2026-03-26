import React, { useState, useEffect } from "react";
import { ShieldAlert, User, Lock, Wifi, WifiOff } from "lucide-react";
import { api } from "../api/sentinelApi";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanLine, setScanLine] = useState(0);

  // Animated scan line effect
  useEffect(() => {
    const t = setInterval(() => setScanLine((p) => (p + 1) % 100), 20);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("CREDENTIALS REQUIRED");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = await api.login(username, password);
      if (data.success) {
        onLogin(data); // Sends { role, token, username } up to App.jsx
      } else {
        setError("ACCESS DENIED — INVALID CREDENTIALS");
      }
    } catch (e) {
      setError("CONNECTION FAILED — CHECK SERVER STATUS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: "100vh", background: "#050608",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      fontFamily: "'Space Mono', monospace",
    }}>
      {/* Background Grid (using class from App.css) */}
      <div className="sentinel-grid" style={{ position: "absolute", inset: 0 }} />
      
      {/* Moving Scan Line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: "rgba(0,212,255,0.15)",
        top: `${scanLine}%`,
        boxShadow: "0 0 10px rgba(0,212,255,0.3)",
      }} />

      <div style={{
        width: 420, position: "relative", zIndex: 1,
        border: "1px solid rgba(0,212,255,0.2)",
        background: "rgba(8,10,16,0.95)",
        padding: "40px",
      }}>
        <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: 2, background: "#00d4ff" }} />

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, border: "2px solid #ff3b3b",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "rotateBorder 8s linear infinite",
            }}>
              <ShieldAlert size={26} color="#ff3b3b" />
            </div>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 26, color: "#e8eaf0", letterSpacing: 4, margin: 0 }}>
            SENTINEL
          </h1>
          <div style={{ fontSize: 11, color: "#00d4ff", letterSpacing: 8, marginTop: 4 }}>
            AI FRAUD DETECTION
          </div>
        </div>

        {/* Input Fields */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 10, color: "#5a6478", letterSpacing: 2, marginBottom: 6 }}>OPERATOR ID</label>
          <div style={{ position: "relative" }}>
            <User size={13} color="#3a4257" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="sentinel-input"
              placeholder="username"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 10, color: "#5a6478", letterSpacing: 2, marginBottom: 6 }}>AUTH KEY</label>
          <div style={{ position: "relative" }}>
            <Lock size={13} color="#3a4257" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sentinel-input"
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.3)",
            color: "#ff3b3b", fontSize: 10, padding: "10px 12px", marginBottom: 20,
          }}>⚠ {error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", background: loading ? "#2a1010" : "#ff3b3b",
            color: "#fff", padding: "14px", fontFamily: "'Orbitron', monospace",
            fontSize: 12, letterSpacing: 3, cursor: loading ? "wait" : "pointer",
            border: "none", fontWeight: 700,
          }}
        >
          {loading ? "AUTHENTICATING..." : "INITIATE SESSION"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)", color: "#e8eaf0",
  padding: "11px 12px 11px 34px", outline: "none",
  fontFamily: "'Space Mono', monospace", fontSize: 12,
  boxSizing: "border-box"
};