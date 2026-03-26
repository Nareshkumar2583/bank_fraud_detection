import { BarChart, Bar, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

export default function VolumeChart({ data }) {
  const chartData = data.map((t, i) => ({ name: i, amount: t.amount }));

  return (
    <div style={{ background: "rgba(8,10,18,0.9)", border: "1px solid rgba(0,212,255,0.1)", padding: "16px" }}>
      <div style={{ fontSize: "10px", color: "#5a6478", letterSpacing: "1px", marginBottom: "10px" }}>TX MAGNITUDE (USD)</div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={chartData}>
          <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{display: 'none'}} />
          <Bar dataKey="amount" fill="#00d4ff" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}