// ─── AppLayout component ───
// CSS Grid layout: 168px sidebar | 1fr scrollable main.
// No top navbar — topbar row lives inside each page.

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function AppLayout() {
  return (
    <div
      className="min-h-screen"
      style={{ display: 'grid', gridTemplateColumns: '168px 1fr' }}
    >
      {/* Sidebar — fixed-height sticky column */}
      <Sidebar />

      {/* Main scrollable content area */}
      <main
        className="overflow-y-auto"
        style={{
          background: 'var(--ss-bg)',
          padding: '16px 18px',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
