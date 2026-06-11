// ─── PlantProgress page ───
// Visual representation of the student's learning growth: plant upgrades & XP trackers.

import { Leaf, Award, Compass, History, Calendar } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { plantHistory, plantActions, currentUser } from '../data/demoData';

function PlantProgress() {
  const { plantName, plantEmoji, plantXP, plantMaxXP, plantLevel } = currentUser;
  const progressPercent = Math.round((plantXP / plantMaxXP) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My Digital Plant"
        description="Watch your learning seed sprout, bloom, and mature as you complete daily goals and master lecture concepts."
        icon={Leaf}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Left: Plant visual & main info */}
        <div className="bg-paper border border-card rounded-xl p-5 text-center flex flex-col justify-between">
          <div className="py-6">
            <div className="text-6xl animate-bounce duration-1000 mb-4">{plantEmoji}</div>
            <h2 className="text-base font-semibold text-text-base capitalize">
              {plantName} · Level {plantLevel}
            </h2>
            <p className="text-[11px] text-text-muted mt-1">
              Active Sprout. Keep studying to unlock flowers and branches!
            </p>
          </div>

          <div className="border-t border-cream-dark pt-4 text-left">
            <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-medium">
              <span>XP Level Progress</span>
              <span>{plantXP} / {plantMaxXP} XP</span>
            </div>
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-sage rounded-full shimmer transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Middle: Daily achievements check-offs */}
        <div className="bg-paper border border-card rounded-xl p-5 flex flex-col">
          <h3 className="text-xs font-semibold text-text-base mb-3 flex items-center gap-1.5">
            <Calendar size={14} className="text-sage" /> Daily Growth Actions
          </h3>
          <p className="text-[10px] text-text-muted mb-4">
            Complete study activities today to feed your digital sprout.
          </p>

          <div className="space-y-2.5 flex-1">
            {plantActions.map((action) => (
              <div
                key={action.id}
                className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  action.done
                    ? 'bg-[#EAF3DE]/30 border-sage-light text-moss'
                    : 'bg-cream/20 border-cream-darker/60 text-text-muted'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{action.done ? '✓' : '○'}</span>
                  <span>{action.label}</span>
                </div>
                <span className="text-[10px] font-semibold text-sage-dark">
                  {action.done ? '+15 XP Claimed' : '+20 XP'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Growth history over days */}
        <div className="bg-paper border border-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-text-base mb-3 flex items-center gap-1.5">
              <History size={14} className="text-sage" /> Growth History
            </h3>
            <p className="text-[10px] text-text-muted mb-4">
              Your weekly height chart based on study minutes & quiz compliance logs.
            </p>

            {/* Simple CSS-based bar chart */}
            <div className="flex items-end justify-between h-32 pt-2 border-b border-cream-dark">
              {plantHistory.map((day) => (
                <div key={day.day} className="flex flex-col items-center flex-1 group">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 bg-text-base text-white text-[8px] px-1 rounded absolute -translate-y-8 transition-opacity duration-150">
                    {day.height}cm
                  </span>
                  <div
                    className="w-4 bg-sage rounded-t-sm group-hover:bg-sage-dark transition-all duration-300"
                    style={{ height: `${day.height}%` }}
                  />
                </div>
              ))}
            </div>
            {/* Days labels */}
            <div className="flex justify-between text-[10px] text-text-light mt-2 px-1">
              {plantHistory.map((day) => (
                <span key={day.day} className="flex-1 text-center">
                  {day.day}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-cream-dark pt-3 mt-4 text-center">
            <div className="text-[10px] text-text-light flex justify-center items-center gap-1">
              <Compass size={11} /> <strong>Total Height:</strong> 82 cm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantProgress;
