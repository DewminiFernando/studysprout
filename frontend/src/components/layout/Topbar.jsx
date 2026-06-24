// ─── Topbar component ───
// Top bar with greeting, stats summary, streak badge, and avatar.

import { useAuth } from '../../context/AuthContext';

function Topbar() {
  const { user, plantProgress } = useAuth();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getSubTitle = () => {
    if (!plantProgress) return 'Welcome back to your study space!';
    if (plantProgress.stage === 'Seed') return 'Plant the seeds of knowledge today! 🌱';
    if (plantProgress.stage === 'Flower') return 'Your plant has fully bloomed! Incredible job! 🌸';
    return `Your plant is growing strong! Stage: ${plantProgress.stage}.`;
  };

  return (
    <div className="px-6 py-[18px] border-b border-card flex items-center justify-between">
      {/* Left: Greeting */}
      <div>
        <div className="text-base font-medium text-text-base">
          {getGreeting()}, {user?.name} 🌤️
        </div>
        <div className="text-xs text-text-muted">
          {getSubTitle()}
        </div>
      </div>

      {/* Right: Streak + Avatar */}
      <div className="flex items-center gap-2.5">
        {plantProgress && (
          <div className="bg-amber-light text-amber text-[11px] px-2.5 py-1 rounded-full font-medium">
            🔥 {plantProgress.study_streak} day streak
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center text-xs font-medium text-sage-dark">
          {user?.initials}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
