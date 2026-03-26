import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendChart({ data }) {
  // Defensive check: Recharts will break if data isn't an array
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div style={{ 
      background: 'rgba(8,10,18,0.9)', 
      padding: '20px', 
      border: '1px solid rgba(0,212,255,0.1)', 
      height: '300px',
      width: '100%' 
    }}>
      <div style={{ fontSize: '10px', color: '#5a6478', letterSpacing: '2px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="animate-pulse" style={{ width: 8, height: 8, background: '#00d4ff', borderRadius: '50%' }} />
        NETWORK RISK VARIANCE INDEX (LIVE)
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0a0c12', border: '1px solid #00d4ff', fontSize: '12px' }}
            itemStyle={{ color: '#00d4ff' }}
          />
          <Area 
            type="monotone" 
            dataKey="risk"  // <-- Double check: transactions.map should return { risk: value }
            stroke="#00d4ff" 
            fillOpacity={1} 
            fill="url(#colorRisk)" 
            isAnimationActive={false} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}