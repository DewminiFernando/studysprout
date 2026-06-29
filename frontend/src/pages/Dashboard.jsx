// ─── Dashboard page ───
// Redesigned main overview page per design spec.
// Layout: Topbar, XP Hero Banner, Continue Card, StatsGrid, sections.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, plantAPI } from '../services/api';

import Topbar from '../components/layout/Topbar';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentMaterials from '../components/dashboard/RecentMaterials';
import WeakTopics from '../components/dashboard/WeakTopics';

function Dashboard() {
  const { fetchPlantProgress } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [earningXp, setEarningXp] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardAPI.getSummary();
      setData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
      setError('Failed to load dashboard summary data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleEarnXp = async () => {
    if (earningXp) return;
    try {
      setEarningXp(true);
      await plantAPI.updateProgress('revise_weak_topic');
      // Sync auth context progress + page progress
      await fetchPlantProgress();
      await fetchSummary();
    } catch (err) {
      console.error('Failed to earn XP:', err);
      // Fallback to quiz
      navigate('/quiz');
    } finally {
      setEarningXp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-ss-green border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-ss-muted">Loading your study dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ss-danger-bg border border-ss-danger text-ss-danger-text text-sm rounded-xl p-4 flex items-center gap-3 mt-4">
        <AlertCircle size={18} className="flex-shrink-0" />
        <span>{error}</span>
        <button
          onClick={fetchSummary}
          className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // Determine Continue studying card vs Upload prompt card
  // Pull the most recently quizzed material (first one in recent_materials with a quiz score)
  const quizzedMaterials = data.recent_materials?.filter(
    (m) => m.lastScore && m.lastScore !== 'N/A'
  ) || [];

  const resumeMaterial = quizzedMaterials.length > 0 ? quizzedMaterials[0] : null;

  // Stage Emojis mapping
  const stageEmojis = {
    'Seed':          '🌱',
    'Sprout':        '🌿',
    'Small Plant':   '🪴',
    'Growing Plant': '🌳',
    'Flower':        '🌸',
  };
  const plantEmoji = stageEmojis[data.plant_progress.stage] || '🌱';
  const xpPercent = data.plant_progress.next_stage_xp > 0
    ? Math.min((data.plant_progress.xp / data.plant_progress.next_stage_xp) * 100, 100)
    : 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Topbar row */}
      <Topbar />

      {/* ── 3. XP Hero Banner ── */}
      <div
        style={{
          background: 'var(--ss-green)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '14px',
        }}
      >
        <div style={{ fontSize: '28px', lineHeight: 1 }}>{plantEmoji}</div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.2 }}>
            {data.plant_progress.stage} · Level {data.plant_progress.level}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
            {data.plant_progress.xp_needed > 0
              ? `${data.plant_progress.xp_needed} XP needed to sprout — keep going!`
              : 'Max stage reached!'}
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: '8px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              overflow: 'hidden',
              marginTop: '6px',
            }}
          >
            <div
              className="shimmer"
              style={{
                height: '100%',
                width: `${xpPercent}%`,
                background: '#C8934A',
                borderRadius: '6px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>
            {data.plant_progress.xp} / {data.plant_progress.next_stage_xp} XP
          </div>
        </div>

        <button
          onClick={handleEarnXp}
          disabled={earningXp}
          style={{
            background: '#C8934A',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif',
            border: 'none',
            cursor: earningXp ? 'not-allowed' : 'pointer',
            transition: 'background 150ms',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!earningXp) e.currentTarget.style.background = '#b2813e';
          }}
          onMouseLeave={(e) => {
            if (!earningXp) e.currentTarget.style.background = '#C8934A';
          }}
        >
          {earningXp ? 'Completing...' : '+ Earn XP'}
        </button>
      </div>

      {/* ── 4. Continue Card ── */}
      {resumeMaterial ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #4A7558',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#EAF2EC',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={16} style={{ color: '#4A7558' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {resumeMaterial.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ss-muted)', marginTop: '2px' }}>
              {resumeMaterial.questions} questions · {resumeMaterial.week}
            </div>
            <div style={{ fontSize: '11px', color: '#4A7558', fontWeight: 500, marginTop: '2px' }}>
              Last score: {resumeMaterial.lastScore}
            </div>
          </div>

          <button
            onClick={() => navigate(`/quiz/${resumeMaterial.id}`)}
            style={{
              background: '#4A7558',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Resume quiz →
          </button>
        </div>
      ) : (
        // Continue studied card replacement - zero state upload prompt
        <div
          onClick={() => navigate('/upload-pdf')}
          style={{
            background: '#FFFFFF',
            border: '1.5px dashed #4A7558',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            marginBottom: '14px',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ss-inner)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--ss-amber-light)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Upload size={16} style={{ color: 'var(--ss-amber)' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)' }}>
              Upload your first lecture to get started
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ss-muted)', marginTop: '2px' }}>
              Get studying materials and generate diagnostic quiz questions automatically.
            </div>
          </div>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--ss-amber-text)',
              background: 'var(--ss-amber-light)',
              padding: '3px 8px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            +10 XP
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <StatsGrid stats={data} />

      {/* Grid for main content blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Recent materials card */}
        <RecentMaterials materials={data.recent_materials} />

        {/* Weak topics card */}
        <WeakTopics topics={data.weak_topics} />
      </div>
    </div>
  );
}

export default Dashboard;
