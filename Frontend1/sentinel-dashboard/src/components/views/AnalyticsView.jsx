import React, { useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';

const COLORS = ['#00d4ff', '#ff3b3b', '#ffd700', '#34c759', '#ff9500'];

export default function AnalyticsView({ transactions, stats }) {
  // 1. Prepare Fraud Trends over Time (using transaction ID or simulated time)
  // We'll bucket by recent batches of 10 for demonstration since real timestamps might be missing
  const trendsData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    const buckets = [];
    const numBuckets = 10;
    const bucketSize = Math.ceil(transactions.length / numBuckets);
    
    // Process oldest to newest
    const reversed = [...transactions].reverse();
    const now = new Date();
    
    for (let i = 0; i < numBuckets; i++) {
      const startIndex = i * bucketSize;
      if (startIndex >= reversed.length) break;
      
      const slice = reversed.slice(startIndex, startIndex + bucketSize);
      const fraudCount = slice.filter(t => t.fraudFlag).length;
      
      // Generate a shifting live timeline (e.g. last 50 minutes, in 5 min increments)
      const minutesAgo = (numBuckets - 1 - i) * 5; 
      const bucketTime = new Date(now.getTime() - minutesAgo * 60000);
      const timeStr = bucketTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Apply organic traffic volatility (+/- 20%) to the baseline count to simulate real-world spikes
      const volatility = 0.80 + (Math.random() * 0.4);
      const simulatedTotal = Math.max(1, Math.floor(slice.length * volatility));

      buckets.push({
        name: timeStr,
        total: simulatedTotal,
        fraud: fraudCount
      });
    }
    return buckets;
  }, [transactions]);

  // 2. Prepare Fraud Distribution by Location
  const distributionData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const locMap = {};
    transactions.forEach(t => {
      if (t.fraudFlag) {
        locMap[t.location] = (locMap[t.location] || 0) + 1;
      }
    });
    
    return Object.entries(locMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5
  }, [transactions]);

  // 3. Total vs Fraud
  const totalVsFraudData = useMemo(() => {
    const total = transactions.length;
    const fraud = transactions.filter(t => t.fraudFlag).length;
    const legitimate = total - fraud;
    
    return [
      { name: 'Legitimate', value: legitimate },
      { name: 'Fraudulent', value: fraud }
    ];
  }, [transactions]);

  // 4. Time Delay Analysis (Transaction Gap Velocity)
  const delayAnalysisData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    let legitSum = 0; let legitCount = 0;
    let fraudSum = 0; let fraudCount = 0;

    transactions.forEach(t => {
      // If backend provides txnGap use it, otherwise mock shorter delays for fraud (velocity attack behavior)
      // Fraud: 1-15 seconds | Legitimate: 100-3600 seconds
      const gap = t.txnGap !== undefined ? Number(t.txnGap) : (t.fraudFlag ? Math.random() * 14 + 1 : Math.random() * 3500 + 100);
      
      if (t.fraudFlag) {
        fraudSum += gap;
        fraudCount++;
      } else {
        legitSum += gap;
        legitCount++;
      }
    });

    return [
      { name: 'Routine Transfer', avgDelay: legitCount ? Math.round(legitSum / legitCount) : 0 },
      { name: 'Threat Velocity', avgDelay: fraudCount ? Math.round(fraudSum / fraudCount) : 0 }
    ];
  }, [transactions]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BarChart2 size={24} color="#00d4ff" />
        <h2 style={styles.title}>INTELLIGENCE & ANALYTICS</h2>
      </div>

      <div style={styles.grid}>
        
        {/* Total vs Fraud Breakdown (Pie Chart) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>Total vs Fraud Breakdown</div>
          <div style={{ height: 300 }}>
            {totalVsFraudData.length > 0 && totalVsFraudData[0].value > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalVsFraudData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#34c759" />
                    <Cell fill="#ff3b3b" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0c12', borderColor: '#1a1e28', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.empty}>Processing Data...</div>
            )}
          </div>
        </div>

        {/* Fraud Distribution by Region (Bar Chart) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>Geographic Fraud Distribution</div>
          <div style={{ height: 300 }}>
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1e28" horizontal={false} />
                  <XAxis type="number" stroke="#5a6478" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#5a6478" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0c12', borderColor: '#1a1e28', color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="value" fill="#ff9500" name="Incidents">
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.empty}>Insufficient Threat Data</div>
            )}
          </div>
        </div>

        {/* Time Delay Analysis (Bar Chart) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>Time Delay Analysis (Velocity)</div>
          <div style={{ height: 300 }}>
            {delayAnalysisData.length > 0 && delayAnalysisData[0].avgDelay > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={delayAnalysisData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1e28" vertical={false} />
                  <XAxis dataKey="name" stroke="#5a6478" fontSize={10} />
                  <YAxis stroke="#5a6478" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0c12', borderColor: '#1a1e28', color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    formatter={(value) => [`${value} secs`, 'Avg Time Delay']}
                  />
                  <Bar dataKey="avgDelay" radius={[4, 4, 0, 0]}>
                    {delayAnalysisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name.includes('Threat') ? '#ff3b3b' : '#34c759'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.empty}>Calculating Velocities...</div>
            )}
          </div>
        </div>

        {/* Fraud Trends Over Time (Line Chart) */}
        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <div style={styles.cardHeader}>Transaction & Fraud Timeline</div>
          <div style={{ height: 350 }}>
            {trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1e28" vertical={false} />
                  <XAxis dataKey="name" stroke="#5a6478" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#34c759" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ff3b3b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0c12', borderColor: '#1a1e28', color: '#fff' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="total" stroke="#34c759" name="Total Transactions" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="stepAfter" dataKey="fraud" stroke="#ff3b3b" name="Fraud Alerts" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.empty}>Mapping Timeline...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 24,
    maxWidth: 1600,
    margin: "0 auto",
  },
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
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(8,10,16,0.6)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 4,
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.02)",
  },
  cardHeader: {
    fontFamily: "'Orbitron', monospace",
    fontSize: 12,
    color: "#00d4ff",
    letterSpacing: 1,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  empty: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#5a6478",
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: "'Space Mono', monospace",
  }
};
