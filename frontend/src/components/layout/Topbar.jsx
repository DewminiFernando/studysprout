// ─── Topbar component ───
// Top bar with greeting, stats summary, streak badge, and avatar.

import { useAuth } from '../../context/AuthContext';

function Topbar() {
  const { user } = useAuth();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="px-6 py-[18px] border-b border-card flex items-center justify-between">
      {/* Left: Greeting */}
      <div>
        <div className="text-base font-medium text-text-base">
          {getGreeting()}, {user?.name} 🌤️
        </div>
        <div className="text-xs text-text-muted">
          3 materials · 2 quizzes pending
        </div>
      </div>

      {/* Right: Streak + Avatar */}
      <div className="flex items-center gap-2.5">
        <div className="bg-amber-light text-amber text-[11px] px-2.5 py-1 rounded-full font-medium">
          🔥 {user?.streak} day streak
        </div>
        <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center text-xs font-medium text-sage-dark">
          {user?.initials}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
