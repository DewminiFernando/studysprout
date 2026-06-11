// ─── MaterialCard component ───
// Displays a single study material with progress and status.

import { FileText } from 'lucide-react';

function MaterialCard({ material }) {
  const { name, questions, week, progress, lastScore, status, statusType } = material;

  return (
    <div className="bg-paper border border-card rounded-xl p-3 px-3.5 cursor-pointer hover:border-sage-light transition-colors">
      {/* Header: icon + title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="w-8 h-8 bg-sage-pale rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={15} className="text-sage-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-text-base leading-snug">{name}</div>
          <div className="text-[10px] text-text-muted mt-0.5">
            {questions} questions · {week}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-cream-dark rounded-full overflow-hidden mt-2">
        <div
          className="h-full bg-sage rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Footer: score + badge */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-sage-dark font-medium">
          Last score: {lastScore}
        </span>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-full ${
            statusType === 'done'
              ? 'bg-sage-pale text-sage-dark'
              : 'bg-amber-light text-amber'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export default MaterialCard;
