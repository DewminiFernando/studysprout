// ─── PlantProgress page ───
// Visual representation of the student's learning growth: plant upgrades & XP trackers.
// Redesigned to match design system ss-* tokens and custom styled widgets.

import { useState, useEffect } from 'react';
import { Leaf, FileText, Sparkles, Pencil, Award, HelpCircle } from 'lucide-react';
import { plantAPI } from '../services/api';
import Topbar from '../components/layout/Topbar';

function PlantProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await plantAPI.getProgress();
      setData(response.data);
    } catch (err) {
      console.error('Failed to load plant progress:', err);
      setError('Failed to load your digital plant progress.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-ss-green border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-ss-muted">Loading your digital plant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ss-danger-bg border border-ss-danger text-ss-danger-text text-sm rounded-xl p-4 flex items-center gap-3 mt-4">
        <span className="flex-1">{error}</span>
        <button
          onClick={fetchProgress}
          className="text-xs font-semibold underline bg-transparent border-none cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const { xp, stage, level, study_streak, next_stage_xp, xp_needed, last_activity_at } = data;
  const progressPercent = next_stage_xp > 0
    ? Math.min((xp / next_stage_xp) * 100, 100)
    : 100;

  // Stages definition
  const STAGES = [
    { name: 'Seed', range: '0–49 XP', emoji: '🌱', minXp: 0 },
    { name: 'Sprout', range: '50–99 XP', emoji: '🌿', minXp: 50 },
    { name: 'Small Plant', range: '100–174 XP', emoji: '🪴', minXp: 100 },
    { name: 'Growing Plant', range: '175–274 XP', emoji: '🌳', minXp: 175 },
    { name: 'Flower', range: '275+ XP', emoji: '🌸', minXp: 275 },
  ];

  // Friendly messages based on stage
  const messages = {
    'Seed': 'Your learning journey is just beginning. Upload notes and slides to sprout!',
    'Sprout': 'A tiny sprout has emerged! Keep studying to help it grow.',
    'Small Plant': 'Look at it grow! Your plant is getting bigger as you practice quizzes.',
    'Growing Plant': 'Almost there! Your plant is growing tall and strong. Just a few more quizzes to bloom!',
    'Flower': 'Incredible! Your plant has fully bloomed into a beautiful flower. You have mastered your study goals! 🌸',
  };

  const currentMessage = messages[stage] || messages['Seed'];

  const stageEmojis = {
    'Seed': '🌱',
    'Sprout': '🌿',
    'Small Plant': '🪴',
    'Growing Plant': '🌳',
    'Flower': '🌸',
  };
  const plantEmoji = stageEmojis[stage] || '🌱';

  // Growth guides
  const GUIDES = [
    { label: 'Upload lecture PDF', xp: '+10 XP', icon: FileText },
    { label: 'Generate AI Questions', xp: '+15 XP', icon: Sparkles },
    { label: 'Complete a study quiz', xp: '+20 XP', icon: Pencil },
    { label: 'Achieve quiz score ≥ 70%', xp: '+25 XP', icon: Award },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Topbar row */}
      <Topbar />

      {/* ── 1. Hero Card ── */}
      <div
        style={{
          background: '#4A7558',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '14px',
          color: '#FFFFFF',
        }}
      >
        {/* Plant emoji */}
        <div style={{ fontSize: '52px', marginBottom: '8px', lineHeight: 1 }}>
          {plantEmoji}
        </div>

        {/* Name */}
        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '4px',
            color: '#FFFFFF',
          }}
        >
          {stage} · Level {level}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '14px',
            maxWidth: '320px',
            margin: '0 auto 14px',
          }}
        >
          {currentMessage}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '10px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '6px',
            maxWidth: '240px',
            margin: '0 auto 6px',
            overflow: 'hidden',
          }}
        >
          <div
            className="shimmer"
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: '#C8934A',
              borderRadius: '6px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        {/* XP label */}
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '6px' }}>
          {xp} / {next_stage_xp} XP
        </div>
      </div>

      {/* ── 2. Growth Stages 5-col Grid ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)', marginBottom: '10px' }}>
          Growth Stages
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
          }}
        >
          {STAGES.map((s) => {
            const isCurrent = s.name === stage;
            const isLocked = xp < s.minXp;

            return (
              <div
                key={s.name}
                style={{
                  background: '#FFFFFF',
                  border: isCurrent ? '1.5px solid #4A7558' : '0.5px solid #D6E4D8',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  opacity: isLocked ? 0.45 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '90px',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '2px', lineHeight: 1 }}>{s.emoji}</div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ss-text)', lineHeight: 1.2 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ss-muted)', marginTop: '2px' }}>
                  {s.range}
                </div>

                {isCurrent && (
                  <span
                    style={{
                      background: '#EAF2EC',
                      color: '#3B6D11',
                      borderRadius: '4px',
                      padding: '1px 6px',
                      fontSize: '9px',
                      fontWeight: 500,
                      marginTop: '6px',
                    }}
                  >
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. XP Guide 2-col Grid ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)', marginBottom: '10px' }}>
          How to earn XP
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {GUIDES.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '0.5px solid #D6E4D8',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4A7558')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D6E4D8')}
              >
                {/* Icon box */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: '#EAF2EC',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} style={{ color: '#4A7558' }} />
                </div>

                {/* Label */}
                <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--ss-text)', flex: 1 }}>
                  {g.label}
                </div>

                {/* XP Pill */}
                <div
                  style={{
                    background: '#EAF2EC',
                    color: '#3B6D11',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {g.xp}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Streak Footer Card ── */}
      <div
        style={{
          background: '#FFFFFF',
          border: '0.5px solid #D6E4D8',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left info */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ss-text)' }}>
            Active streak: {study_streak} day{study_streak === 1 ? '' : 's'} 🔥
          </div>
          {last_activity_at && (
            <div style={{ fontSize: '11px', color: 'var(--ss-muted)', marginTop: '2px' }}>
              Last activity: {new Date(last_activity_at).toLocaleString()}
            </div>
          )}
        </div>

        {/* Right info */}
        <div style={{ fontSize: '11px', color: 'var(--ss-muted)', textAlign: 'right' }}>
          Keep studying daily to protect your streak!
        </div>
      </div>
    </div>
  );
}

export default PlantProgress;
