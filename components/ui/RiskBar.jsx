'use client';

export function RiskBar({ label, value, color, detail }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium text-forest-light">{label}</span>
        <span className="text-xs font-mono font-bold text-forest">{value}%</span>
      </div>
      <div className="h-2 bg-parchment rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      {detail && (
        <div className="text-[10px] text-forest-light mt-1">{detail}</div>
      )}
    </div>
  );
}
