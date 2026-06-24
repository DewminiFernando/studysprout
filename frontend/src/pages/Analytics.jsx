// ─── Analytics page ───
// Renders learning analytics: study score trends, topic masteries, and weak topic analysis.

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import { quizAPI, plantAPI } from '../services/api';
import { AlertCircle } from 'lucide-react';

function Analytics() {
  const COLORS = ['#7A9E87', '#B8D4C0', '#4A7558', '#C8934A'];

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
        <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-text-muted">Loading learning analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-4">
        <div className="bg-danger-light/20 border border-danger/20 text-danger text-sm rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchAnalyticsData} className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <PageHeader
          title="Learning Analytics"
          description="Monitor study completion, diagnostic quiz performance, and topic weaknesses over time."
          icon={BarChart3}
        />
        <div className="bg-paper border border-card rounded-xl p-10 text-center flex flex-col items-center justify-center mt-4">
          <div className="w-12 h-12 bg-sage-pale text-sage rounded-full flex items-center justify-center mb-3">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">No analytics data yet</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Take a practice quiz in Quiz Mode first! Once you complete a quiz, your score trends, weak topics, and mastery insights will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Calculate aggregates
  const completedQuizzesCount = history.length;
  const averageScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / completedQuizzesCount);
  const bestScore = Math.round(Math.max(...history.map((h) => h.score)));
  const studyStreak = plant ? plant.study_streak : 0;
  const plantStage = plant ? `${plant.stage} · Lvl ${plant.level}` : 'Seed · Lvl 1';

  // Format Quiz history scores for trend chart (take up to last 7 attempts in chronological order)
  const weeklyScores = history
    .slice(0, 7)
    .reverse()
    .map((h, idx) => ({
      week: new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: Math.round(h.score),
    }));

  // Topic mastery pie chart data: calculate correct vs incorrect per topic using weakTopics list
  const topicBreakdown = weakTopics.map((wt) => {
    const correct = wt.total_questions - wt.weak_answers;
    return {
      topic: wt.topic,
      correct: correct,
      total: wt.total_questions,
      accuracy: Math.round((correct / wt.total_questions) * 100),
    };
  });

  const totalQuestions = topicBreakdown.reduce((acc, curr) => acc + curr.total, 0);
  const correctQuestions = topicBreakdown.reduce((acc, curr) => acc + curr.correct, 0);
  const overallMastery = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : averageScore;

  const pieData = topicBreakdown.length > 0 
    ? topicBreakdown.map((t) => ({ name: t.topic, value: t.correct }))
    : [{ name: 'All Mastered', value: 100 }];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <PageHeader
        title="Learning Analytics"
        description="Monitor study completion, diagnostic quiz performance, and topic weaknesses over time."
        icon={BarChart3}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-sage-pale text-sage-dark rounded-lg flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-xl font-semibold text-text-base">{overallMastery}%</div>
            <div className="text-[10px] text-text-muted mt-0.5">Avg Quiz Accuracy</div>
          </div>
        </div>

        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-cream-dark text-amber rounded-lg flex items-center justify-center">
            <Award size={18} />
          </div>
          <div>
            <div className="text-base font-semibold text-text-base truncate max-w-[120px] capitalize">{plantStage}</div>
            <div className="text-[10px] text-text-muted mt-0.5">Plant Growth Stage</div>
          </div>
        </div>

        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#EAF3DE] text-moss rounded-lg flex items-center justify-center">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-xl font-semibold text-text-base">{studyStreak} Days</div>
            <div className="text-[10px] text-text-muted mt-0.5">Active Study Streak</div>
          </div>
        </div>

        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-sage-pale text-sage-dark rounded-lg flex items-center justify-center">
            <Award size={18} />
          </div>
          <div>
            <div className="text-xl font-semibold text-text-base">{bestScore}%</div>
            <div className="text-[10px] text-text-muted mt-0.5">Best Quiz Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Over Time Chart */}
        <div className="bg-paper border border-card rounded-xl p-4 md:p-5">
          <h3 className="text-xs font-semibold text-text-base mb-4">Quiz Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyScores}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE9DF" />
                <XAxis dataKey="week" stroke="#6B7E6E" fontSize={10} tickLine={false} />
                <YAxis stroke="#6B7E6E" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFB',
                    border: '1px solid rgba(122,158,135,0.2)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#2C3A2E',
                  }}
                />
                <Bar dataKey="score" fill="#7A9E87" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Breakdown Chart */}
        <div className="bg-paper border border-card rounded-xl p-4 md:p-5">
          <h3 className="text-xs font-semibold text-text-base mb-4">Topic Accuracy Distribution</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFEFB',
                      border: '1px solid rgba(122,158,135,0.2)',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
              {topicBreakdown.length === 0 ? (
                <div className="text-[10px] text-text-muted italic">All topics masterfully answered! 🌟</div>
              ) : (
                topicBreakdown.map((t, idx) => (
                  <div key={t.topic} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span>
                      {t.topic} ({t.accuracy}%)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics Analysis Section */}
      <div className="bg-paper border border-card rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-text-base mb-3 uppercase tracking-wider">
          Weak Topics Analysis
        </h3>

        {weakTopics.length === 0 ? (
          <div className="text-center py-8 bg-[#EAF3DE]/10 rounded-xl border border-dashed border-sage-light/40">
            <p className="text-xs text-text-muted font-medium">No weak topics detected yet! 🌱</p>
            <p className="text-[10px] text-text-light mt-1">Take practice quizzes to identify subjects needing revision.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {weakTopics.map((wt, idx) => (
              <div
                key={idx}
                className="bg-cream/30 border border-cream-darker/60 rounded-xl p-4 flex flex-col justify-between hover:border-sage/30 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xs font-bold text-text-base truncate pr-2 max-w-[70%]">
                      {wt.topic}
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-danger-light text-danger font-bold border border-danger/10">
                      Weakness: {(wt.weakness_rate * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="text-[10px] text-text-muted space-y-1.5 mt-2.5">
                    <div className="flex justify-between">
                      <span>Incorrect Answers:</span>
                      <span className="font-semibold text-text-base">{wt.weak_answers} / {wt.total_questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Semantic Match:</span>
                      <span className="font-semibold text-text-base">{wt.average_similarity.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar representation */}
                <div className="mt-4 pt-1 border-t border-cream-dark">
                  <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber rounded-full"
                      style={{ width: `${wt.weakness_rate * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
