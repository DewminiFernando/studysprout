// ─── RecentMaterials component ───
// Section card (spec §6) wrapping Material Rows (spec §7).
// Each row: icon box | name + sub | score + retake button.

import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTION_CARD_STYLE = {
  background: '#FFFFFF',
  border: '0.5px solid #D6E4D8',
  borderRadius: '10px',
  padding: '12px 14px',
};

function RecentMaterials({ materials }) {
  const navigate = useNavigate();
  const displayMaterials = (materials || []).slice(0, 5);

  return (
    <div style={SECTION_CARD_STYLE}>
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)' }}>
          Recent materials
        </span>
        {displayMaterials.length > 0 && (
          <button
            onClick={() => navigate('/my-materials')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              color: '#4A7558',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            See all →
          </button>
        )}
      </div>

      {/* Material rows */}
      {displayMaterials.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0',
            fontSize: '12px',
            color: 'var(--ss-muted)',
          }}
        >
          No materials yet — upload your first PDF to get started! 🌱
        </div>
      ) : (
        <div>
          {displayMaterials.map((material, idx) => (
            <MaterialRow
              key={material.id ?? idx}
              material={material}
              isLast={idx === displayMaterials.length - 1}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MaterialRow({ material, isLast, navigate }) {
  const name = material.name || material.title || 'Untitled';
  const questions = material.questions ?? material.total_questions ?? 0;
  const score = material.lastScore ?? material.last_score ?? null;
  const uploadDate = material.created_at
    ? new Date(material.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : material.week ?? '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 0',
        borderBottom: isLast ? 'none' : '0.5px solid #EEF2EF',
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: '28px',
          height: '28px',
          background: '#EAF2EC',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FileText size={14} style={{ color: '#4A7558' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--ss-text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--ss-muted)', marginTop: '1px' }}>
          {questions} questions{uploadDate ? ` · ${uploadDate}` : ''}
        </div>
        {score != null && (
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#4A7558', marginTop: '1px' }}>
            Last score: {score}{typeof score === 'number' ? '%' : ''}
          </div>
        )}
      </div>

      {/* Retake button */}
      {material.id && (
        <button
          onClick={() => navigate(`/quiz/${material.id}`)}
          style={{
            background: 'transparent',
            border: '0.5px solid #4A7558',
            color: '#4A7558',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Retake
        </button>
      )}
    </div>
  );
}

export default RecentMaterials;
