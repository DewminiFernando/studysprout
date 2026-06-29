// ─── StatCard component ───
// Dashboard metric card: icon → big number → label → CTA hint.
// Navigates on click via React Router Link.

import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

function StatCard({ label, value, icon, ctaLabel, to }) {
  const IconComponent = Icons[icon] || Icons.Activity;

  const card = (
    <div
      style={{
        background: '#FFFFFF',
        border: '0.5px solid #D6E4D8',
        borderRadius: '10px',
        padding: '10px 12px',
        cursor: to ? 'pointer' : 'default',
        transition: 'border-color 150ms',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
      onMouseEnter={(e) => {
        if (to) e.currentTarget.style.borderColor = '#4A7558';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#D6E4D8';
      }}
    >
      {/* Icon */}
      <IconComponent
        size={14}
        style={{ color: '#4A7558', marginBottom: '6px' }}
      />

      {/* Stat number */}
      <div
        style={{
          fontSize: '22px',
          fontWeight: 500,
          color: 'var(--ss-text)',
          lineHeight: 1.1,
        }}
      >
        {value ?? '—'}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: '10px',
          color: 'var(--ss-muted)',
          marginTop: '1px',
        }}
      >
        {label}
      </div>

      {/* CTA hint */}
      {ctaLabel && (
        <div
          style={{
            fontSize: '10px',
            color: '#4A7558',
            marginTop: '4px',
            fontWeight: 500,
          }}
        >
          {ctaLabel}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </Link>
    );
  }

  return card;
}

export default StatCard;
