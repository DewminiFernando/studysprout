// ─── PlantWidget component ───
// Shows the user's plant growth progress in the sidebar.
// Label uses Caveat; XP numbers use DM Mono.

import { useAuth } from '../../context/AuthContext';

function PlantWidget() {
  const { plantProgress } = useAuth();

  if (!plantProgress) {
    return (
      <div className="bg-paper rounded-2xl p-3 border border-[#D8E8D8] flex items-center justify-center h-16">
        <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stage, level, xp, next_stage_xp } = plantProgress;
  const progressPercent = next_stage_xp > 0 ? Math.round((xp / next_stage_xp) * 100) : 100;

  const stageEmojis = {
    'Seed':          '🌱',
    'Sprout':        '🌿',
    'Small Plant':   '🪴',
    'Growing Plant': '🌳',
    'Flower':        '🌸',
  };
  const plantEmoji = stageEmojis[stage] || '🌱';

  return (
    <div className="bg-paper rounded-2xl p-3 border border-[#D8E8D8]">
      {/* Plant emoji */}
      <div className="text-lg mb-1">{plantEmoji}</div>

      {/* Plant label — Caveat for the decorative name */}
      <div className="font-caveat text-[13px] font-semibold text-sage capitalize">
        {stage} · Lvl <span className="font-dm-mono">{level}</span>
      </div>

      {/* XP info — DM Mono for numbers */}
      <div className="text-[10px] text-text-muted mt-1 mb-1.5">
        <span className="font-dm-mono">{xp}</span>
        {' / '}
        <span className="font-dm-mono">{next_stage_xp}</span>
        {' XP to bloom'}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-sage rounded-full shimmer transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default PlantWidget;
