import React from 'react';

export default function NeuralGauge({ probability = 0 }) {
  const percentage = Math.round(probability * 100);
  
  // Color shifts from Green -> Yellow -> Red
  const getColor = (p) => {
    if (p < 30) return '#10b981'; // Emerald
    if (p < 70) return '#f59e0b'; // Amber
    return '#ef4444';             // Rose
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-xl">
      <div className="text-[10px] font-black tracking-widest text-blue-400 mb-4 uppercase">
        Neural Engine Load
      </div>
      
      <div className="relative w-40 h-40">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80" cy="80" r="70"
            stroke="currentColor" strokeWidth="8" fill="transparent"
            className="text-slate-800"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="80" cy="80" r="70"
            stroke={getColor(percentage)} strokeWidth="8" fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * percentage) / 100}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{percentage}%</span>
          <span className="text-[10px] text-slate-500 font-mono">RISK PROB</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className={`h-2 w-2 rounded-full animate-pulse ${percentage > 70 ? 'bg-red-500' : 'bg-blue-500'}`} />
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          {percentage > 70 ? 'High Threat Detected' : 'Analyzing Stream...'}
        </span>
      </div>
    </div>
  );
}