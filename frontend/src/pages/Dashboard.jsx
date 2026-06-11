// ─── Dashboard page ───
// Main overview page with stats, upload CTA, materials, and weak topics.

import { useState } from 'react';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentMaterials from '../components/dashboard/RecentMaterials';
import WeakTopics from '../components/dashboard/WeakTopics';
import UploadCard from '../components/ui/UploadCard';
import { dashboardTabs } from '../data/demoData';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-card -mx-6 px-6">
        {dashboardTabs.map((tab) => (
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
          {/* Stats Row */}
          <StatsGrid />

          {/* Upload CTA */}
          <UploadCard />

          {/* Recent Materials */}
          <RecentMaterials />

          {/* Weak Topics */}
          <WeakTopics />
        </>
      )}

      {/* Weak Topics Tab */}
      {activeTab === 'Weak topics' && (
        <div className="bg-paper border border-card rounded-xl p-5">
          <WeakTopics />
          <p className="text-xs text-text-muted mt-4">
            More detailed weak topic analysis will be available once the AI backend is connected.
          </p>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'History' && (
        <div className="bg-paper border border-card rounded-xl p-5">
          <p className="text-[13px] font-medium text-text-base mb-2">Study History</p>
          <p className="text-xs text-text-muted">
            Your study session history will appear here once you start taking quizzes and studying materials.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
