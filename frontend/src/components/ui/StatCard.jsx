// ─── StatCard component ───
// Displays a single dashboard metric (icon + value + label).

import * as Icons from 'lucide-react';

function StatCard({ label, value, icon, iconBg, iconColor }) {
  // Dynamically pick the Lucide icon by name
  const IconComponent = Icons[icon] || Icons.Activity;

  return (
    <div className="bg-paper border border-card rounded-xl p-3.5">
      {/* Icon */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${iconBg} ${iconColor}`}>
        <IconComponent size={14} />
      </div>
      {/* Value */}
      <div className="text-xl font-medium text-text-base">{value}</div>
      {/* Label */}
      <div className="text-[11px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

export default StatCard;
