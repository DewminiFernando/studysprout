// ─── Topbar component ───
// Top bar with greeting, stats summary, streak badge, and avatar.
// Greeting headline uses Caveat; subtitle and other text use Nunito.
// Streak number uses DM Mono.

import { useAuth } from '../../context/AuthContext';

function Topbar() {
  const { user, plantProgress } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getSubTitle = () => {
    if (!plantProgress) return 'Welcome back to your study space!';
    if (plantProgress.stage === 'Seed')   return 'Plant the seeds of knowledge today.';
    if (plantProgress.stage === 'Flower') return 'Your plant has fully bloomed. Incredible work!';
    return `Your plant is growing strong — Stage: ${plantProgress.stage}.`;
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="px-6 py-4 border-b border-[#D8E8D8] flex items-center justify-between bg-white/60">
      {/* Left: Greeting */}
      <div>
        {/* Caveat for the headline greeting */}
        <div className="font-caveat text-[22px] font-bold text-text-base leading-tight">
          {getGreeting()}, {user?.name ?? 'Learner'} 🌤️
        </div>
        <div className="text-xs text-text-muted mt-0.5">
          {getSubTitle()}
        </div>
      </div>

      {/* Right: Streak + Avatar */}
      <div className="flex items-center gap-3">
        {plantProgress && (
          <div className="bg-accent-amber/40 text-amber text-[11px] px-3 py-1 rounded-full font-semibold border border-accent-amber/60">
            🔥 <span className="font-dm-mono">{plantProgress.study_streak}</span> day streak
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-sage-pale border border-[#D8E8D8] flex items-center justify-center text-xs font-bold text-sage">
          {initials}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
