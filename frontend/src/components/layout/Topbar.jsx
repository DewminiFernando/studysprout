// ─── Topbar component ───
// Inline topbar row used at the top of each authenticated page.
// Left: time-based greeting + subtitle. Right: streak pill + avatar circle.

import { useAuth } from '../../context/AuthContext';
import { Flame } from 'lucide-react';

function Topbar() {
  const { user, plantProgress } = useAuth();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: 'Good morning', emoji: '☀️' };
    if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const { text: greetText, emoji: greetEmoji } = getGreeting();

  const getSubtitle = () => {
    if (!plantProgress) return 'Welcome back to your study space!';
    const { stage } = plantProgress;
    if (stage === 'Seed')   return 'Plant the seeds of knowledge today!';
    if (stage === 'Flower') return 'Your plant has fully bloomed — incredible work!';
    return `Your ${stage.toLowerCase()} is growing strong — keep it up!`;
  };

  const streak = plantProgress?.study_streak ?? 0;
  const streakStrong = streak >= 7;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex items-center justify-between mb-[14px]">
      {/* Left: Greeting */}
      <div>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--ss-text)',
            lineHeight: 1.3,
          }}
        >
          {greetText}, {user?.name ?? 'Learner'} {greetEmoji}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ss-muted)', marginTop: '2px' }}>
          {getSubtitle()}
        </div>
      </div>

      {/* Right: Streak pill + avatar */}
      <div className="flex items-center gap-2">
        {/* Streak pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: streakStrong ? '#FFEDD5' : 'var(--ss-amber-light)',
            border: `1px solid ${streakStrong ? '#C8934A' : '#F4A535'}`,
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--ss-amber-text)',
            whiteSpace: 'nowrap',
          }}
        >
          <Flame size={13} style={{ color: '#F4A535' }} />
          {streak} day streak
        </div>

        {/* Avatar */}
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'var(--ss-green)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
