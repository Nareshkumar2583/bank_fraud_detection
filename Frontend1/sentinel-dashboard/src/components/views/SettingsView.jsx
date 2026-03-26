import React, { useState, useEffect } from 'react';
import { Settings, Shield, Network, CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import { api } from '../../api/sentinelApi';

const DEFAULTS = {
  autoFreezeThreshold: 90,
  require2FA: true,
  emailEscalation: true,
  mlEndpoint: "http://localhost:8000",
  pollingInterval: 3000,
};

export default function SettingsView({ auth }) {
  const [config,   setConfig]   = useState(DEFAULTS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState(null);

  // Load from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getSettings(auth?.token);
        setConfig(c => ({ ...c, ...data }));
      } catch (e) {
        setError("Could not load settings from server — using defaults.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth?.token]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.saveSettings(auth?.token, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError("Failed to save settings. Check backend connection.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key, value) => setConfig(c => ({ ...c, [key]: value }));

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, color: "#5a6478", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
      <Loader size={18} className="animate-spin" /> LOADING CONFIGURATION...
    </div>
  );

  return (
    <div style={S.container}>
      <div style={S.header}>
        <Settings size={24} color="#5a6478" />
        <h2 style={S.title}>SYSTEM SETTINGS</h2>
      </div>

      <div style={S.grid}>
        {/* Security Policies */}
        <div style={S.card}>
          <div style={S.cardHeader}><Shield size={16} color="#00d4ff" /> SECURITY POLICIES</div>

          <SettingRow label="Auto-Freeze Threshold" desc="Freeze accounts with risk score above threshold">
            <select
              style={S.select}
              value={config.autoFreezeThreshold}
              onChange={e => set("autoFreezeThreshold", Number(e.target.value))}
            >
              <option value={95}>Extreme (&gt;95%)</option>
              <option value={90}>High (&gt;90%)</option>
              <option value={80}>Moderate (&gt;80%)</option>
            </select>
          </SettingRow>

          <SettingRow label="Require 2FA for Admin Actions" desc="Enforce multi-factor for simulation toggles">
            <input
              type="checkbox"
              style={S.toggle}
              checked={config.require2FA}
              onChange={e => set("require2FA", e.target.checked)}
            />
          </SettingRow>

          <SettingRow label="Automated Email Escalation" desc="Dispatch SMTP email for extreme threats (>₹10,000 + >95% Risk)">
            <input
              type="checkbox"
              style={S.toggle}
              checked={config.emailEscalation}
              onChange={e => set("emailEscalation", e.target.checked)}
            />
          </SettingRow>
        </div>

        {/* Network Architecture */}
        <div style={S.card}>
          <div style={S.cardHeader}><Network size={16} color="#34c759" /> NETWORK ARCHITECTURE</div>

          <SettingRow label="ML Core Inference Endpoint" desc="FastAPI XGBoost Model Server URL">
            <input
              type="text"
              style={S.input}
              value={config.mlEndpoint}
              onChange={e => set("mlEndpoint", e.target.value)}
            />
          </SettingRow>

          <SettingRow label="Polling Interval (ms)" desc="Frequency of data synchronization">
            <input
              type="number"
              style={S.input}
              value={config.pollingInterval}
              min={1000}
              step={500}
              onChange={e => set("pollingInterval", Number(e.target.value))}
            />
          </SettingRow>
        </div>
      </div>

      {/* Status & Save */}
      {error && (
        <div style={S.errorBanner}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
        <button onClick={handleSave} disabled={saving} style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1 }}>
          {saving
            ? <><Loader size={13} className="animate-spin" /> SAVING...</>
            : <><CheckCircle size={13} /> SAVE CONFIGURATION</>}
        </button>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34c759", fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
            <CheckCircle size={13} /> CONFIGURATION SAVED TO BACKEND
          </div>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={S.settingRow}>
      <div>
        <div style={S.settingLabel}>{label}</div>
        <div style={S.settingDesc}>{desc}</div>
      </div>
      {children}
    </div>
  );
}

const S = {
  container:   { padding: 24, maxWidth: 1000, margin: "0 auto" },
  header:      { display: "flex", alignItems: "center", gap: 15, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 15 },
  title:       { fontFamily: "'Orbitron', monospace", fontSize: 18, color: "#e8eaf0", letterSpacing: 2, margin: 0 },
  grid:        { display: "grid", gap: 24 },
  card:        { background: "rgba(8,10,16,0.6)", border: "1px solid rgba(255,255,255,0.05)", padding: 24, borderRadius: 4 },
  cardHeader:  { display: "flex", alignItems: "center", gap: 10, fontFamily: "'Orbitron', monospace", color: "#e8eaf0", fontSize: 12, letterSpacing: 1, marginBottom: 24, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.02)" },
  settingRow:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" },
  settingLabel: { fontSize: 12, color: "#e8eaf0", fontFamily: "'Space Mono', monospace", marginBottom: 4 },
  settingDesc:  { fontSize: 10, color: "#5a6478", fontFamily: "'Space Mono', monospace" },
  select:  { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaf0", padding: "8px 12px", fontSize: 11, fontFamily: "'Space Mono', monospace", outline: "none" },
  input:   { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaf0", padding: "8px 12px", fontSize: 11, fontFamily: "'Space Mono', monospace", outline: "none", width: 220 },
  toggle:  { accentColor: "#00d4ff", transform: "scale(1.3)", cursor: "pointer" },
  saveBtn: { display: "flex", alignItems: "center", gap: 8, background: "rgba(0,212,255,0.1)", border: "1px solid #00d4ff", color: "#00d4ff", padding: "12px 24px", fontSize: 11, fontFamily: "'Orbitron', monospace", cursor: "pointer", letterSpacing: 1 },
  errorBanner: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.3)", color: "#ff3b3b", fontSize: 10, padding: "10px 16px", marginTop: 16 },
};


export default function SettingsView({ auth }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Settings size={24} color="#5a6478" />
        <h2 style={styles.title}>SYSTEM SETTINGS</h2>
      </div>

      <div style={styles.grid}>
        {/* Security Policies */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Shield size={16} color="#00d4ff" /> SECURITY POLICIES
          </div>
          
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Auto-Freeze Threshold</div>
              <div style={styles.settingDesc}>Freeze accounts with risk score above threshold</div>
            </div>
            <select style={styles.select} defaultValue="90">
              <option value="95">Extreme (&gt;95%)</option>
              <option value="90">High (&gt;90%)</option>
              <option value="80">Moderate (&gt;80%)</option>
            </select>
          </div>

          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Require 2FA for Admin Actions</div>
              <div style={styles.settingDesc}>Enforce multi-factor for simulation toggles</div>
            </div>
            <input type="checkbox" defaultChecked style={styles.toggle} />
          </div>

          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Automated Email Escalation</div>
              <div style={styles.settingDesc}>Dispatch SMTP email routing for extreme threats (&gt;$10,000 + &gt;95% Risk)</div>
            </div>
            <input type="checkbox" defaultChecked style={styles.toggle} />
          </div>
        </div>

        {/* Network & Integrations */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Network size={16} color="#34c759" /> NETWORK ARCHITECTURE
          </div>
          
          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>ML Core Inference Endpoint</div>
              <div style={styles.settingDesc}>FastAPI XGBoost Model Server URL</div>
            </div>
            <input type="text" defaultValue="http://localhost:8000" style={styles.input} />
          </div>

          <div style={styles.settingRow}>
            <div>
              <div style={styles.settingLabel}>Polling Interval (ms)</div>
              <div style={styles.settingDesc}>Frequency of data synchronization</div>
            </div>
            <input type="number" defaultValue="3000" style={styles.input} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1000, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 24,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: 15,
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 18,
    color: "#e8eaf0",
    letterSpacing: 2,
    margin: 0,
  },
  grid: {
    display: "grid",
    gap: 24,
  },
  card: {
    background: "rgba(8,10,16,0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: 24,
    borderRadius: 4,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Orbitron', monospace",
    color: "#e8eaf0",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 24,
    paddingBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.02)"
  },
  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.02)",
  },
  settingLabel: {
    fontSize: 12,
    color: "#e8eaf0",
    fontFamily: "'Space Mono', monospace",
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 10,
    color: "#5a6478",
    fontFamily: "'Space Mono', monospace",
  },
  select: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
    padding: "8px 12px",
    fontSize: 11,
    fontFamily: "'Space Mono', monospace",
    outline: "none",
  },
  input: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
    padding: "8px 12px",
    fontSize: 11,
    fontFamily: "'Space Mono', monospace",
    outline: "none",
    width: 200,
  },
  toggle: {
    accentColor: "#00d4ff",
    transform: "scale(1.2)"
  }
};

