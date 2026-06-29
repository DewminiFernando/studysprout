// ─── StatsGrid component ───
// 4-column stat card grid. Each card links to its relevant page.
// Follows spec §5: icon → number → label → CTA hint.

import StatCard from '../ui/StatCard';

function StatsGrid({ stats }) {
  const avgScore = stats?.average_quiz_score;
  const scoreDisplay = (!avgScore || avgScore === 0 || avgScore === '0%')
    ? '—'
    : (typeof avgScore === 'number' ? `${avgScore}%` : avgScore);

  const items = [
    {
      id:       'pdfs',
      label:    'PDFs uploaded',
      value:    stats?.total_pdfs ?? 0,
      icon:     'FileText',
      ctaLabel: 'View materials →',
      to:       '/my-materials',
    },
    {
      id:       'questions',
      label:    'Questions generated',
      value:    stats?.total_questions ?? 0,
      icon:     'ListChecks',
      ctaLabel: 'Open question bank →',
      to:       '/question-bank',
    },
    {
      id:       'score',
      label:    'Avg quiz score',
      value:    scoreDisplay,
      icon:     'CheckCircle',
      ctaLabel: 'See analytics →',
      to:       '/analytics',
    },
    {
      id:       'weak',
      label:    'Weak topics',
      value:    stats?.weak_topics?.length ?? 0,
      icon:     'AlertCircle',
      ctaLabel: 'Revise now →',
      to:       '/analytics#weak-topics',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '14px',
      }}
    >
      {items.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          ctaLabel={stat.ctaLabel}
          to={stat.to}
        />
      ))}
    </div>
  );
}

export default StatsGrid;
