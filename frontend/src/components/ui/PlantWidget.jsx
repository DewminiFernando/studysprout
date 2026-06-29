// ─── PlantWidget component ───
// Bottom-of-sidebar plant progress widget.
// Dark sidebar style: rgba(0,0,0,0.2) bg, amber progress bar fill.

import { useAuth } from '../../context/AuthContext';

function PlantWidget() {
  const { plantProgress } = useAuth();

  if (!plantProgress) {
    return (
      <div
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '58px',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  const { stage, level, xp, next_stage_xp } = plantProgress;
  const progressPercent = next_stage_xp > 0
    ? Math.min((xp / next_stage_xp) * 100, 100)
    : 100;

  const stageEmojis = {
    'Seed':          '🌱',
    'Sprout':        '🌿',
    'Small Plant':   '🪴',
    'Growing Plant': '🌳',
    'Flower':        '🌸',
  };
  const plantEmoji = stageEmojis[stage] || '🌱';

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        padding: '10px 12px',
      }}
    >
      {/* Plant emoji + label row */}
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ fontSize: '18px', lineHeight: 1 }}>{plantEmoji}</span>
        <div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.2,
            }}
          >
            {stage} · Lv {level}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '5px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '4px',
        }}
      >
        <div
          className="shimmer"
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: '#C8934A',
            borderRadius: '4px',
            transition: 'width 0.7s ease',
          }}
        />
      </div>

      {/* XP caption */}
      <div
        style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {xp} / {next_stage_xp} XP to bloom
      </div>
    </div>
  );
}

export default PlantWidget;
