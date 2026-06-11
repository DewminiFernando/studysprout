// ─── Analytics page ───
// Renders learning analytics: study score trends and topic masteries.

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

function Analytics() {
  const COLORS = ['#7A9E87', '#B8D4C0', '#4A7558', '#C8934A'];

  // Calculate some simple aggregates
  const totalQuestions = analyticsData.topicBreakdown.reduce((acc, curr) => acc + curr.total, 0);
  const correctQuestions = analyticsData.topicBreakdown.reduce((acc, curr) => acc + curr.correct, 0);
  const overallMastery = Math.round((correctQuestions / totalQuestions) * 100);

  const pieData = analyticsData.topicBreakdown.map((t) => ({
    name: t.topic,
    value: t.correct,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Learning Analytics"
        description="Monitor study completion, diagnostic quiz performance, and topic weaknesses over time."
        icon={BarChart3}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
    </div>
  );
}

export default Analytics;
