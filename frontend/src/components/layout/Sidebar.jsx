// ─── Sidebar component ───
// Left navigation panel with logo, nav items, and plant widget.
// Logo uses Caveat; all nav labels use Nunito (inherits from body).

import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import PlantWidget from '../ui/PlantWidget';
import { useAuth } from '../../context/AuthContext';

const SIDEBAR_NAV_ITEMS = {
  main: [
    { label: 'Dashboard',    icon: 'LayoutDashboard', path: '/dashboard' },
    { label: 'Upload PDF',   icon: 'Upload',          path: '/upload-pdf' },
    { label: 'My Materials', icon: 'BookOpen',         path: '/my-materials' },
  ],
  study: [
    { label: 'Question Bank', icon: 'ListChecks', path: '/question-bank' },
    { label: 'Quiz Mode',     icon: 'Pencil',     path: '/quiz' },
    { label: 'Study Mode',    icon: 'Eye',         path: '/study-mode' },
  ],
  progress: [
    { label: 'Analytics', icon: 'BarChart3', path: '/analytics' },
    { label: 'My Plant',  icon: 'Leaf',      path: '/plant-progress' },
  ],
};

function Sidebar() {
  const { logout } = useAuth();

  const renderNavItem = (item) => {
    const IconComponent = Icons[item.icon] || Icons.Circle;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-2.5 py-2.5 px-[18px] text-[13px] cursor-pointer transition-all duration-150 no-underline ${
            isActive
              ? 'bg-white text-sage font-semibold border-r-2 border-sage'
              : 'text-text-muted hover:text-text-base hover:bg-white/60'
          }`
        }
      >
        <IconComponent size={15} />
        {item.label}
      </NavLink>
    );
  };

  const renderSection = (title) => (
    <div
      key={title}
      className="text-[9px] tracking-[0.12em] uppercase text-text-light px-[18px] pt-4 pb-1.5 font-semibold"
    >
      {title}
    </div>
  );

  return (
    <aside className="w-[204px] flex-shrink-0 bg-sage-pale border-r border-[#D8E8D8] flex flex-col py-5 h-screen sticky top-0">
      {/* Logo — Caveat for brand name only */}
      <div className="px-[18px] pb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-sage rounded-xl flex items-center justify-center text-base">
          🌱
        </div>
        <div>
          <div className="font-caveat text-[17px] font-bold text-sage leading-tight">
            StudySprout
          </div>
          <div className="text-[9px] text-text-light tracking-wide">AI Study Assistant</div>
        </div>
      </div>

      {/* Navigation */}
      {renderSection('Main')}
      {SIDEBAR_NAV_ITEMS.main.map(renderNavItem)}

      {renderSection('Study')}
      {SIDEBAR_NAV_ITEMS.study.map(renderNavItem)}

      {renderSection('Progress')}
      {SIDEBAR_NAV_ITEMS.progress.map(renderNavItem)}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Plant widget */}
      <div className="mx-[14px] mb-2">
        <PlantWidget />
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="flex items-center gap-2.5 py-2 px-[18px] mx-[14px] mb-4 text-[13px] font-semibold text-danger hover:bg-danger-light/30 rounded-[10px] cursor-pointer transition-all duration-150 border-0 bg-transparent text-left"
      >
        <Icons.LogOut size={15} />
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
