// ─── PlantWidget component ───
// Shows the user's plant growth progress in the sidebar.

import { useAuth } from '../../context/AuthContext';

function PlantWidget() {
  const { plantProgress } = useAuth();

  if (!plantProgress) {
    return (
      <div className="bg-paper rounded-xl p-3 border border-card flex items-center justify-center h-16">
        <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stage, level, xp, next_stage_xp } = plantProgress;
  const progressPercent = next_stage_xp > 0 ? Math.round((xp / next_stage_xp) * 100) : 100;

  const stageEmojis = {
    'Seed': '🌱',
    'Sprout': '🌿',
    'Small Plant': '🪴',
    'Growing Plant': '🌳',
    'Flower': '🌸',
  };
  const plantEmoji = stageEmojis[stage] || '🌱';

  return (
    <div className="bg-paper rounded-xl p-3 border border-card">
      {/* Plant emoji */}
      <div className="text-lg mb-1">{plantEmoji}</div>

      {/* Plant label */}
      <div className="text-[11px] font-medium text-sage-dark capitalize">
        {stage} · Lvl {level}
      </div>

      {/* XP info */}
      <div className="text-[10px] text-text-muted mt-1 mb-1.5">
        {xp} / {next_stage_xp} XP to bloom
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-sage rounded-full shimmer transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default PlantWidget;
