// ─── StatsGrid component ───
// Renders 4 stat cards in a responsive grid.

import StatCard from '../ui/StatCard';

function StatsGrid({ stats }) {
  const items = [
    {
      id: 'pdfs',
      label: 'PDFs uploaded',
      value: stats?.total_pdfs ?? 0,
      icon: 'FileText',
      iconBg: 'bg-sage-pale',
      iconColor: 'text-sage-dark',
    },
    {
      id: 'questions',
      label: 'Questions generated',
      value: stats?.total_questions ?? 0,
      icon: 'HelpCircle',
      iconBg: 'bg-cream-dark',
      iconColor: 'text-amber',
    },
    {
      id: 'score',
      label: 'Avg quiz score',
      value: stats?.average_quiz_score ?? '0%',
      icon: 'CheckCircle',
      iconBg: 'bg-[#EAF3DE]',
      iconColor: 'text-moss',
    },
    {
      id: 'weak',
      label: 'Weak topics',
      value: stats?.weak_topics?.length ?? 0,
      icon: 'AlertCircle',
      iconBg: 'bg-amber-light',
      iconColor: 'text-amber',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {items.map((stat) => (
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
