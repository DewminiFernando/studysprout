// ─── WeakTopics component ───
// Shows topic revision tags (weak = amber, ok = sage).

function WeakTopics({ topics }) {
  const displayTopics = topics || [];

  return (
    <div>
      <div className="text-[13px] font-medium text-text-base mb-1.5">
        Topics to revise
      </div>
      {displayTopics.length === 0 ? (
        <div className="text-left py-2 text-xs text-text-muted italic">
          No weak topics detected. 🌱 Practice quizzes to find areas of improvement!
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {displayTopics.map((topic) => (
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
      )}
    </div>
  );
}

export default WeakTopics;
