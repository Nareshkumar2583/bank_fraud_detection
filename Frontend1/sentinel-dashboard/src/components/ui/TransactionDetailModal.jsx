import React, { useMemo } from 'react';
import { X, ShieldAlert, Fingerprint, MapPin, Cpu, BarChart3, Clock, CreditCard, Phone, Hash } from 'lucide-react';
import { fmt, riskColor } from '../../utils/formatters';

export default function TransactionDetailModal({ tx, onClose }) {
  const { phone, account } = useMemo(() => {
    if (!tx) return { phone: "", account: "" };
    // Deterministic random based on tx.transactionId
    const seed = tx.transactionId || 1234;
    
    // Generate phone: +91 98[XX] [XX]XX12
    const p1 = Math.floor(Math.abs(Math.sin(seed) * 90) + 10);
    const p2 = Math.floor(Math.abs(Math.cos(seed) * 90) + 10);
    const phone = `+91 98${p1} ${p2}XX12`;

    // Generate account: 12 digits -> YY******ZZZZ
    const a1 = Math.floor(Math.abs(Math.sin(seed + 1) * 90) + 10); // First 2
    const a2 = Math.floor(Math.abs(Math.cos(seed + 2) * 9000) + 1000); // Last 4
    const accountStr = `${a1}******${a2}`;
    
    return { phone, account: accountStr };
  }, [tx?.transactionId]);

  if (!tx) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      {/* StopPropagation prevents the modal from closing when clicking inside the content */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ ...styles.header, borderBottom: `2px solid ${riskColor(tx.riskScore)}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Cpu size={20} color={riskColor(tx.riskScore)} />
            <div style={{ fontFamily: "'Orbitron', monospace", letterSpacing: 2 }}>
              <div style={{ fontSize: 9, color: '#5a6478' }}>NEURAL ANALYSIS ENGINE</div>
              <div style={{ fontSize: 13 }}>TX_REF: {tx.transactionId}</div>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        </div>

        <div style={styles.content}>
          {/* ML Risk Summary */}
          <div style={{ ...styles.riskHero, background: `${riskColor(tx.riskScore)}0a` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#5a6478', marginBottom: 8 }}>CONFIDENCE SCORE</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: riskColor(tx.riskScore), fontFamily: 'Orbitron' }}>
                {tx.riskScore}<span style={{ fontSize: 18 }}>%</span>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 20 }}>
              <div style={{ fontSize: 10, color: '#5a6478' }}>DETECTION LOGIC</div>
              <div style={{ fontSize: 14, color: tx.fraudFlag ? '#ff3b3b' : '#34c759', marginTop: 5, fontWeight: 'bold' }}>
                {tx.detectionReason || "Consistent with user behavior profile."}
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div style={styles.grid}>
            <DetailItem icon={<Fingerprint size={14}/>} label="SENDER ID" value={tx.senderId} />
            <DetailItem icon={<MapPin size={14}/>} label="ORIGIN" value={tx.location} />
            <DetailItem icon={<Phone size={14}/>} label="PHONE NUMBER" value={phone} />
            <DetailItem icon={<Hash size={14}/>} label="ACCOUNT NUMBER" value={account} />
            <DetailItem icon={<CreditCard size={14}/>} label="MERCHANT" value={tx.merchantName} />
            <DetailItem icon={<Clock size={14}/>} label="TIMESTAMP" value={new Date().toLocaleString()} />
          </div>

          {/* System Verdict */}
          <div style={styles.footer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {tx.fraudFlag ? (
                <>
                  <ShieldAlert size={18} color="#ff3b3b" />
                  <span style={{ color: '#ff3b3b', fontSize: 11, fontWeight: 'bold' }}>ASSET FROZEN: HIGH FRAUD PROBABILITY</span>
                </>
              ) : (
                <>
                  <BarChart3 size={18} color="#34c759" />
                  <span style={{ color: '#34c759', fontSize: 11, fontWeight: 'bold' }}>CLEARANCE GRANTED: ROUTINE TRANSACTION</span>
                </>
              )}
            </div>
            <button onClick={onClose} style={styles.actionBtn}>ACKNOWLEDGE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5a6478', fontSize: 9, marginBottom: 5 }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: 12, color: '#e8eaf0', wordBreak: 'break-all' }}>{value}</div>
  </div>
);

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' },
  modal: { width: '550px', background: '#0a0c12', border: '1px solid #1a1e28', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  header: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' },
  closeBtn: { background: 'none', border: 'none', color: '#5a6478', cursor: 'pointer' },
  content: { padding: '24px' },
  riskHero: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, padding: '25px', marginBottom: 24, alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  footer: { marginTop: 24, paddingTop: 20, borderTop: '1px solid #1a1e28', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actionBtn: { padding: '10px 20px', background: '#1a1e28', border: '1px solid #3a4257', color: '#fff', fontSize: 10, cursor: 'pointer', fontFamily: 'Orbitron' }
};