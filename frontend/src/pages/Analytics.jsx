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
import { analyticsData } from '../data/demoData';
import { quizAPI } from '../services/api';

function Analytics() {
  const COLORS = ['#7A9E87', '#B8D4C0', '#4A7558', '#C8934A'];

  const [weakTopics, setWeakTopics] = useState([]);
  const [loadingWeak, setLoadingWeak] = useState(true);
  const [errorWeak, setErrorWeak] = useState('');

  useEffect(() => {
    const fetchWeakTopics = async () => {
      try {
        setLoadingWeak(true);
        setErrorWeak('');
        const response = await quizAPI.getWeakTopics();
        setWeakTopics(response.data || []);
      } catch (err) {
        console.error('Failed to load weak topics:', err);
        setErrorWeak('Failed to load weak topics analysis.');
      } finally {
        setLoadingWeak(false);
      }
    };

    fetchWeakTopics();
  }, []);

  // Calculate some simple aggregates
  const totalQuestions = analyticsData.topicBreakdown.reduce((acc, curr) => acc + curr.total, 0);
  const correctQuestions = analyticsData.topicBreakdown.reduce((acc, curr) => acc + curr.correct, 0);
  const overallMastery = Math.round((correctQuestions / totalQuestions) * 100);

  const pieData = analyticsData.topicBreakdown.map((t) => ({
    name: t.topic,
    value: t.correct,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <PageHeader
        title="Learning Analytics"
        description="Monitor study completion, diagnostic quiz performance, and topic weaknesses over time."
        icon={BarChart3}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-sage-pale text-sage-dark rounded-lg flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-xl font-semibold text-text-base">{overallMastery}%</div>
            <div className="text-[10px] text-text-muted mt-0.5">Average Topic Accuracy</div>
          </div>
        </div>

        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-cream-dark text-amber rounded-lg flex items-center justify-center">
            <Award size={18} />
          </div>
          <div>
            <div className="text-xl font-semibold text-text-base">Level 3</div>
            <div className="text-[10px] text-text-muted mt-0.5">Plant Growth Stage</div>
          </div>
        </div>

        <div className="bg-paper border border-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#EAF3DE] text-moss rounded-lg flex items-center justify-center">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-xl font-semibold text-text-base">5 Days</div>
            <div className="text-[10px] text-text-muted mt-0.5">Active Study Streak</div>
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
                data={analyticsData.weeklyScores}
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
              {analyticsData.topicBreakdown.map((t, idx) => (
                <div key={t.topic} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span>
                    {t.topic} ({Math.round((t.correct / t.total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics Analysis Section */}
      <div className="bg-paper border border-card rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-semibold text-text-base mb-3 uppercase tracking-wider">
          Weak Topics Analysis
        </h3>

        {loadingWeak ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-7 h-7 border-3 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-text-muted">Loading weakness analytics...</p>
          </div>
        ) : errorWeak ? (
          <div className="text-xs text-danger text-center py-6">{errorWeak}</div>
        ) : weakTopics.length === 0 ? (
          <div className="text-center py-8 bg-cream/20 rounded-xl border border-dashed border-cream-darker/60">
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
