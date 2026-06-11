// ─── StatsGrid component ───
// Renders 4 stat cards in a responsive grid.

import StatCard from '../ui/StatCard';
import { dashboardStats } from '../../data/demoData';

function StatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}

export default StatsGrid;
