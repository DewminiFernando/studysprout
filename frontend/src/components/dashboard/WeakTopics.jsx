// ─── WeakTopics component ───
// Shows topic revision tags (weak = amber, ok = sage).

import { weakTopics } from '../../data/demoData';

function WeakTopics() {
  return (
    <div>
      <div className="text-[13px] font-medium text-text-base mb-1.5">
        Topics to revise
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {weakTopics.map((topic) => (
          <span
            key={topic.id}
            className={`text-[11px] px-2.5 py-1 rounded-full ${
              topic.type === 'weak'
                ? 'bg-amber-light text-amber'
                : 'bg-sage-pale text-sage-dark'
            }`}
          >
            {topic.name}
            {topic.type === 'ok' && ' ✓'}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WeakTopics;
