import React, { useState, useMemo } from 'react';
import { List, Search, Ghost, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import TransactionRow from '../ui/TransactionRow';
import TransactionDetailModal from '../ui/TransactionDetailModal';

export default function TransactionsView({ transactions }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    let base = transactions;
    if (filter === "fraud") base = base.filter(t => t.fraudFlag);
    if (filter === "safe") base = base.filter(t => !t.fraudFlag);

    return base.filter(t =>
      t.transactionId?.toString().includes(searchQuery) ||
      t.senderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery, filter]);


  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Sentinel AI - Transaction Ledger Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${filteredData.length}`, 14, 34);
    
    const tableColumn = ["ID", "Sender / Account", "Amount (₹)", "Risk", "Status", "Location"];
    const tableRows = [];

    filteredData.forEach(tx => {
      const rowData = [
        tx.transactionId || 'N/A',
        tx.senderId || 'N/A',
        parseFloat(tx.amount || 0).toFixed(2),
        `${tx.riskScore}%`,
        tx.fraudFlag ? 'THREAT' : 'SAFE',
        tx.location || 'N/A'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [24, 28, 38], textColor: [0, 212, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("sentinel_ledger_export.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <List size={24} color="#00d4ff" />
          <h2 style={styles.title}>TRANSACTION LEDGER</h2>
        </div>
        
        <div style={styles.actions}>
          <div style={styles.searchBox}>
            <Search size={14} color="#5a6478" />
            <input
              type="text"
              placeholder="SEARCH SENDER/LOC/ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">ALL STATUS</option>
            <option value="fraud">FRAUD ONLY</option>
            <option value="safe">SAFE ONLY</option>
          </select>

          <button style={styles.exportBtn} onClick={exportToPDF}>
            <Download size={14} /> EXPORT PDF
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.gridHeader}>
          <div>ID</div>
          <div>Sender / Account</div>
          <div>Amount (₹)</div>
          <div>Risk</div>
          <div>Status</div>
          <div>Location</div>
        </div>
        <div style={styles.scrollArea}>
          {filteredData.length > 0 ? (
            filteredData.map(tx => (
              <TransactionRow 
                key={tx.transactionId} 
                tx={tx} 
                isNew={false} 
                onClick={setSelectedTx} 
              />
            ))
          ) : (
            <div style={styles.emptyState}>
              <Ghost size={32} color="#1a1e28" />
              <div style={{ marginTop: 10 }}>NO MATCHING RECORDS FOUND</div>
            </div>
          )}
        </div>
      </div>

      {selectedTx && <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1600, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  actions: { display: 'flex', gap: 12, alignItems: 'center' },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(0,0,0,0.3)",
    padding: "8px 15px",
    borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.05)",
  },
  searchInput: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 11,
    outline: "none",
    width: 250,
    letterSpacing: 1,
    fontFamily: "'Space Mono', monospace",
  },
  select: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "#e8eaf0",
    padding: "8px 12px",
    fontSize: 11,
    fontFamily: "'Space Mono', monospace",
    borderRadius: 4,
    outline: "none",
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: "rgba(0,212,255,0.1)",
    border: "1px solid #00d4ff",
    color: "#00d4ff",
    padding: "8px 15px",
    borderRadius: 4,
    fontSize: 11,
    fontFamily: "'Space Mono', monospace",
    cursor: "pointer",
  },
  tableContainer: {
    background: "rgba(8,10,16,0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  gridHeader: {
    display: "grid",
    gridTemplateColumns: "80px 1.5fr 150px 120px 120px 1fr",
    gap: 16,
    padding: "16px 20px",
    background: "rgba(0,0,0,0.5)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    color: "#00d4ff",
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: "'Orbitron', monospace",
  },
  scrollArea: {
    height: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  emptyState: {
    padding: 60,
    textAlign: "center",
    color: "#5a6478",
    fontSize: 11,
    letterSpacing: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
};
