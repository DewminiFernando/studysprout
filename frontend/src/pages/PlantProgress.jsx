// ─── PlantProgress page ───
// Visual representation of the student's learning growth: plant upgrades & XP trackers.

import { useState, useEffect } from 'react';
import { Leaf, Award, AlertCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { plantAPI } from '../services/api';

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
        <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-text-muted">Loading your digital plant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-light/20 border border-danger/20 text-danger text-sm rounded-xl p-4 flex items-center gap-3 mt-4">
        <AlertCircle size={18} className="flex-shrink-0" />
        <span>{error}</span>
        <button onClick={fetchProgress} className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  const { xp, stage, level, study_streak, next_stage_xp, xp_needed, last_activity_at } = data;
  const progressPercent = next_stage_xp > 0 ? Math.round((xp / next_stage_xp) * 100) : 100;

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
    'Seed': 'Your learning journey is just beginning. Plant the seeds of knowledge by uploading lecture notes and slides!',
    'Sprout': 'A tiny sprout has emerged! Keep studying, generating questions, and completing quizzes to help it grow.',
    'Small Plant': 'Look at it grow! Your plant is getting bigger as you practice more quizzes and review weak topics.',
    'Growing Plant': 'Almost there! Your plant is growing tall and strong. Just a few more study sessions to bloom!',
    'Flower': 'Incredible! Your plant has fully bloomed into a beautiful flower. You have mastered your study goals! 🌸',
  };

  const currentMessage = messages[stage] || messages['Seed'];

  // Map stage emojis
  const stageEmojis = {
    'Seed': '🌱',
    'Sprout': '🌿',
    'Small Plant': '🪴',
    'Growing Plant': '🌳',
    'Flower': '🌸',
  };
  const plantEmoji = stageEmojis[stage] || '🌱';

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
              {stage} · Level {level}
            </h2>
            <p className="text-[11px] text-text-muted mt-2 px-2 font-medium">
              {currentMessage}
            </p>
          </div>

          <div className="border-t border-cream-dark pt-4 text-left">
            <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-semibold">
              <span>XP Level Progress</span>
              <span>{xp} / {next_stage_xp} XP</span>
            </div>
            <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-sage rounded-full shimmer transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Middle: Plant Growth Stages list */}
        <div className="bg-paper border border-card rounded-xl p-5 flex flex-col">
          <h3 className="text-xs font-bold text-text-base mb-3 flex items-center gap-1.5 uppercase tracking-wide">
            <Award size={14} className="text-sage" /> Growth Stages
          </h3>
          <p className="text-[10px] text-text-muted mb-4 font-medium">
            Gain XP through study actions to watch your plant evolve.
          </p>

          <div className="space-y-2 flex-1">
            {STAGES.map((s) => {
              const isCurrent = s.name === stage;
              const isPassed = xp >= s.minXp;
              return (
                <div
                  key={s.name}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-[#EAF3DE]/40 border-sage-light text-moss font-semibold shadow-sm'
                      : isPassed
                      ? 'bg-cream/10 border-cream-darker/30 text-text-muted opacity-80'
                      : 'bg-cream/5 border-transparent text-text-light opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.emoji}</span>
                    <div>
                      <div className="text-[11px]">{s.name}</div>
                      <div className="text-[9px] text-text-light font-medium">{s.range}</div>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-sage text-white text-center font-bold">
                      Current Stage
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Growth Guide & XP Rules */}
        <div className="bg-paper border border-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-text-base mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <Award size={14} className="text-sage" /> Growth Guide
            </h3>
            <p className="text-[10px] text-text-muted mb-4 font-medium">
              Perform these study activities to earn XP and level up your digital plant:
            </p>

            <div className="space-y-2.5 mt-2">
              <div className="flex items-center justify-between text-xs p-2 bg-cream/20 rounded-lg border border-cream-darker/30">
                <span className="flex items-center gap-2">
                  <span className="text-sm">📤</span>
                  <span className="font-medium text-text-base">Upload PDF</span>
                </span>
                <span className="text-[10px] font-bold text-sage-dark bg-[#EAF3DE] px-2 py-0.5 rounded">
                  +10 XP
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-cream/20 rounded-lg border border-cream-darker/30">
                <span className="flex items-center gap-2">
                  <span className="text-sm">✨</span>
                  <span className="font-medium text-text-base">Generate Questions</span>
                </span>
                <span className="text-[10px] font-bold text-sage-dark bg-[#EAF3DE] px-2 py-0.5 rounded">
                  +15 XP
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-cream/20 rounded-lg border border-cream-darker/30">
                <span className="flex items-center gap-2">
                  <span className="text-sm">📝</span>
                  <span className="font-medium text-text-base">Complete a Quiz</span>
                </span>
                <span className="text-[10px] font-bold text-sage-dark bg-[#EAF3DE] px-2 py-0.5 rounded">
                  +20 XP
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-cream/20 rounded-lg border border-cream-darker/30">
                <span className="flex items-center gap-2">
                  <span className="text-sm">🏆</span>
                  <span className="font-medium text-text-base">Quiz Score ≥ 70%</span>
                </span>
                <span className="text-[10px] font-bold text-sage-dark bg-[#EAF3DE] px-2 py-0.5 rounded">
                  +25 XP
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-cream-dark pt-3 mt-4">
            <div className="text-[10px] text-text-light flex flex-col gap-1 text-center font-medium">
              <div><strong>Active Study Streak:</strong> {study_streak} Days 🔥</div>
              {last_activity_at && (
                <div className="text-[9px]">
                  <strong>Last Activity:</strong> {new Date(last_activity_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantProgress;
