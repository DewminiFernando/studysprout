// ─── AppLayout component ───
// Main layout wrapper: sidebar on left, content area on right.

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Topbar />

        {/* Page content — rendered by React Router <Outlet> */}
        <main className="flex-1 p-5 px-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
