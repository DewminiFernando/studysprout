// ─── Analytics page ───
// Renders learning analytics: study score trends, topic masteries, and weak topic analysis.
// Redesigned to use design system ss-* tokens and custom styled widgets.

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Award, Clock, Check, AlertCircle } from 'lucide-react';
import { quizAPI, plantAPI } from '../services/api';
import Topbar from '../components/layout/Topbar';

function Analytics() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      const [historyRes, weakTopicsRes, plantRes] = await Promise.all([
        quizAPI.getQuizHistory(),
        quizAPI.getWeakTopics(),
        plantAPI.getProgress(),
      ]);
      setHistory(historyRes.data || []);
      setWeakTopics(weakTopicsRes.data || []);
      setPlant(plantRes.data || null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load learning analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-ss-green border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-ss-muted">Loading learning analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-4">
        <div className="bg-ss-danger-bg border border-ss-danger text-ss-danger-text text-sm rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchAnalyticsData}
            className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate aggregates
  const completedQuizzesCount = history.length;
  const averageScore = completedQuizzesCount > 0
    ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / completedQuizzesCount)
    : 0;
  const bestScore = completedQuizzesCount > 0
    ? Math.round(Math.max(...history.map((h) => h.score)))
    : 0;

  const studyStreak = plant ? plant.study_streak : 0;
  const plantStage = plant ? `${plant.stage} · Lvl ${plant.level}` : 'Seed · Lvl 1';

  // Format accuracy display: If average accuracy is 0/null: show "—" in muted color, not "0%"
  const accuracyDisplay = averageScore > 0 ? `${averageScore}%` : '—';

  // Format streak display: If streak is 1, show "1" normally (or any other number)
  const streakDisplay = studyStreak > 0 ? studyStreak : '—';

  // Custom Chart calculation
  // Show up to 7 attempts (newest on the right, so we reverse a sliced copy)
  const chartAttempts = [...history].slice(0, 7).reverse();
  const maxChartBars = 7;
  const placeholdersCount = Math.max(0, maxChartBars - chartAttempts.length);

  // Active item details for captions
  const activeChartIndex = chartAttempts.length - 1;
  const latestAttempt = chartAttempts[activeChartIndex];
  
  let captionText = 'No quizzes yet — complete a quiz to see analysis';
  if (latestAttempt) {
    const attemptDate = new Date(latestAttempt.created_at).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const scoreVal = Math.round(latestAttempt.score);
    let scoreMsg = 'Needs revision';
    if (scoreVal >= 85) scoreMsg = 'Excellent mastery!';
    else if (scoreVal >= 70) scoreMsg = 'Good understanding';
    captionText = `${attemptDate} — ${scoreVal}% · ${scoreMsg}`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Topbar row */}
      <Topbar />

      {/* ── 1. Stat cards grid (same as dashboard spec) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '14px',
        }}
      >
        {/* Avg quiz score card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '0.5px solid #D6E4D8',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <TrendingUp size={14} style={{ color: '#4A7558', marginBottom: '6px' }} />
          <div
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: averageScore > 0 ? 'var(--ss-text)' : 'var(--ss-subtle)',
              lineHeight: 1.1,
            }}
          >
            {accuracyDisplay}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ss-muted)', marginTop: '1px' }}>
            Avg accuracy
          </div>
        </div>

        {/* Plant stage card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '0.5px solid #D6E4D8',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <Award size={14} style={{ color: '#4A7558', marginBottom: '6px' }} />
          <div
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--ss-text)',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {plantStage.split(' · ')[0]}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ss-muted)', marginTop: '1px' }}>
            Stage · Level {plant?.level ?? 1}
          </div>
        </div>

        {/* Streak card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '0.5px solid #D6E4D8',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <Clock size={14} style={{ color: '#4A7558', marginBottom: '6px' }} />
          <div
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--ss-text)',
              lineHeight: 1.1,
            }}
          >
            {streakDisplay}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ss-muted)', marginTop: '1px' }}>
            Active streak
          </div>
        </div>

        {/* Best Score card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '0.5px solid #D6E4D8',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <Award size={14} style={{ color: '#4A7558', marginBottom: '6px' }} />
          <div
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: bestScore > 0 ? 'var(--ss-text)' : 'var(--ss-subtle)',
              lineHeight: 1.1,
            }}
          >
            {bestScore > 0 ? `${bestScore}%` : '—'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ss-muted)', marginTop: '1px' }}>
            Best quiz score
          </div>
        </div>
      </div>

      {/* ── 2. Chart Card ── */}
      <div className="bg-white rounded-[10px] border border-[#D6E4D8] p-4 mb-3.5">
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)' }}>
          Quiz Score Trend
        </div>

        {/* Chart wrapper */}
        <div className="mx-auto mt-3 h-[95px] max-w-[900px] rounded-[8px] bg-[#F0EDE8] flex items-end justify-center gap-24 px-8 pb-0">
          {/* Render real scores */}
          {chartAttempts.map((attempt, idx) => {
            const hPct = Math.max(8, Math.round(attempt.score));
            return (
              <div
                key={attempt.attempt_id || idx}
                style={{
                  height: `${hPct}%`,
                  width: '24px',
                  backgroundColor: '#4A7558',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.4s ease',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                title={`Quiz on ${new Date(attempt.created_at).toLocaleDateString()}: ${Math.round(attempt.score)}%`}
              />
            );
          })}

          {/* Render future placeholders */}
          {Array.from({ length: placeholdersCount }).map((_, idx) => (
            <div
              key={`place-${idx}`}
              style={{
                height: '25%',
                width: '24px',
                backgroundColor: '#B8D4C0',
                borderRadius: '3px 3px 0 0',
                opacity: 0.75,
              }}
              title="Future quiz placeholder"
            />
          ))}
        </div>

        {/* Below chart: 10px muted caption */}
        <div
          style={{
            fontSize: '10px',
            color: 'var(--ss-muted)',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          {captionText}
        </div>
      </div>

      {/* ── 3. Weak Topics Analysis (Full Width Card) ── */}
      <div
        id="weak-topics"
        style={{
          background: '#FFFFFF',
          border: '0.5px solid #D6E4D8',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ss-muted)',
            padding: '10px 14px',
            borderBottom: '0.5px solid #EEF2EF',
          }}
        >
          Weak Topics Analysis
        </div>

        {weakTopics.length === 0 ? (
          /* Zero state checkmark card */
          <div
            style={{
              backgroundColor: '#EAF2EC',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--ss-green)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={16} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)' }}>
              No weak topics yet — complete a quiz to see analysis
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ss-muted)' }}>
              All your quiz concepts are mastered. Keep up the amazing work! 🌱
            </div>
          </div>
        ) : (
          <div>
            {weakTopics.map((wt, idx) => {
              const isHigh = wt.weakness_rate >= 0.6;
              const isMed = wt.weakness_rate >= 0.3 && wt.weakness_rate < 0.6;
              const pct = Math.round(wt.weakness_rate * 100);

              let badgeStyle = {
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 500,
                alignSelf: 'center',
              };
              let badgeBg = '#EAF2EC';
              let badgeColor = '#3B6D11';
              let badgeLabel = 'Low Weakness';
              let fill = '#4A7558';

              if (isHigh) {
                badgeBg = '#FCEBEB';
                badgeColor = '#A32D2D';
                badgeLabel = 'High Weakness';
                fill = '#E24B4A';
              } else if (isMed) {
                badgeBg = '#FAEEDA';
                badgeColor = '#633806';
                badgeLabel = 'Med Weakness';
                fill = '#EF9F27';
              }

              return (
                <div
                  key={wt.topic || idx}
                  style={{
                    padding: '12px 14px',
                    borderBottom: idx === weakTopics.length - 1 ? 'none' : '0.5px solid #EEF2EF',
                  }}
                >
                  {/* Top row: name | badge */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ss-text)' }}>
                      {wt.topic}
                    </span>
                    <span style={{ ...badgeStyle, backgroundColor: badgeBg, color: badgeColor }}>
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '11px',
                      color: 'var(--ss-muted)',
                      marginBottom: '6px',
                    }}
                  >
                    <span>Incorrect answers: {wt.weak_answers}/{wt.total_questions}</span>
                    <span>Avg semantic match: {wt.average_similarity.toFixed(2)}</span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      backgroundColor: '#F0EDE8',
                      borderRadius: '4px',
                      height: '6px',
                      overflow: 'hidden',
                      marginBottom: '6px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: fill,
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: '4px',
                      }}
                    />
                  </div>

                  {/* CTA link */}
                  <div style={{ marginTop: '6px' }}>
                    <Link
                      to={`/quiz?topic=${encodeURIComponent(wt.topic)}`}
                      style={{
                        fontSize: '11px',
                        color: '#4A7558',
                        textDecoration: 'none',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      ▶ Start targeted quiz on {wt.topic}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
