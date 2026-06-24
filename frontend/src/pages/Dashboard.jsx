// ─── Dashboard page ───
// Main overview page with stats, upload CTA, materials, and weak topics.

import { useState, useEffect } from 'react';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentMaterials from '../components/dashboard/RecentMaterials';
import WeakTopics from '../components/dashboard/WeakTopics';
import UploadCard from '../components/ui/UploadCard';
import { dashboardAPI } from '../services/api';
import { AlertCircle, Leaf } from 'lucide-react';

const DASHBOARD_TABS = ['Overview', 'Weak topics', 'History'];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-text-muted">Loading your study dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-light/20 border border-danger/20 text-danger text-sm rounded-xl p-4 flex items-center gap-3 mt-4">
        <AlertCircle size={18} className="flex-shrink-0" />
        <span>{error}</span>
        <button onClick={fetchSummary} className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-card -mx-6 px-6">
        {DASHBOARD_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-3.5 py-2.5 cursor-pointer border-b-2 -mb-px transition-colors bg-transparent ${
              activeTab === tab
                ? 'text-sage-dark border-sage font-medium'
                : 'text-text-muted border-transparent hover:text-text-base'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'Overview' && (
        <>
          {/* Plant progress widget banner */}
          <div className="bg-paper border border-card rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-bounce duration-1000">
                {data.plant_progress.stage === 'Seed' && '🌱'}
                {data.plant_progress.stage === 'Sprout' && '🌿'}
                {data.plant_progress.stage === 'Small Plant' && '🪴'}
                {data.plant_progress.stage === 'Growing Plant' && '🌳'}
                {data.plant_progress.stage === 'Flower' && '🌸'}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-base leading-none capitalize">
                  {data.plant_progress.stage} · Level {data.plant_progress.level}
                </h3>
                <p className="text-[10px] text-text-muted mt-1 font-medium">
                  {data.plant_progress.xp_needed > 0
                    ? `${data.plant_progress.xp_needed} XP needed for next stage`
                    : 'Max stage reached!'}
                </p>
              </div>
            </div>
            
            <div className="flex-1 w-full sm:max-w-xs">
              <div className="flex justify-between text-[9px] text-text-muted mb-1 font-semibold">
                <span>XP Progress</span>
                <span>{data.plant_progress.xp} / {data.plant_progress.next_stage_xp} XP</span>
              </div>
              <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-sage rounded-full shimmer transition-all duration-700"
                  style={{
                    width: `${Math.round(
                      (data.plant_progress.xp / data.plant_progress.next_stage_xp) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-[#EAF3DE]/50 border border-sage-light/60 text-moss rounded-lg px-3 py-1.5 text-center flex-shrink-0">
              <div className="text-[9px] uppercase font-bold tracking-wider text-sage-dark">Streak</div>
              <div className="text-xs font-semibold text-text-base">{data.study_streak} Days 🔥</div>
            </div>
          </div>

          {/* Stats Row */}
          <StatsGrid stats={data} />

          {/* Upload CTA */}
          <UploadCard />

          {/* Recent Materials */}
          <RecentMaterials materials={data.recent_materials} />

          {/* Weak Topics */}
          <WeakTopics topics={data.weak_topics} />
        </>
      )}

      {/* Weak Topics Tab */}
      {activeTab === 'Weak topics' && (
        <div className="bg-paper border border-card rounded-xl p-5">
          <WeakTopics topics={data.weak_topics} />
          <p className="text-xs text-text-muted mt-4">
            Practice diagnostics by taking quizzes in Quiz Mode to identify more weak topics.
          </p>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'History' && (
        <div className="bg-paper border border-card rounded-xl p-5">
          <p className="text-[13px] font-semibold text-text-base mb-3">Study History</p>
          {data.quiz_history.length === 0 ? (
            <p className="text-xs text-text-muted">
              Your study session history will appear here once you start taking quizzes and studying materials.
            </p>
          ) : (
            <div className="space-y-2">
              {data.quiz_history.map((item) => (
                <div
                  key={item.attempt_id}
                  className="p-3 bg-cream/10 border border-cream-darker/40 rounded-xl flex items-center justify-between text-xs hover:border-sage/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-text-base">{item.material_name}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {item.total_questions} questions · {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`font-semibold text-sm ${item.score >= 70 ? 'text-sage-dark' : 'text-amber'}`}>
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
