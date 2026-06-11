// ─── PlantWidget component ───
// Shows the user's plant growth progress in the sidebar.

import { currentUser } from '../../data/demoData';

function PlantWidget() {
  const { plantEmoji, plantName, plantXP, plantMaxXP } = currentUser;
  const progressPercent = Math.round((plantXP / plantMaxXP) * 100);

  return (
    <div className="bg-paper rounded-xl p-3 border border-card">
      {/* Plant emoji */}
      <div className="text-lg mb-1">{plantEmoji}</div>

      {/* Plant label */}
      <div className="text-[11px] font-medium text-sage-dark">{plantName}</div>

      {/* XP info */}
      <div className="text-[11px] text-text-muted mt-1 mb-1.5">
        {plantXP} / {plantMaxXP} pts to bloom
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
