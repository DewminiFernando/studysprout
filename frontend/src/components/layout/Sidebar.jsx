// ─── Sidebar component ───
// Left navigation panel with logo, nav items, and plant widget.

import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import PlantWidget from '../ui/PlantWidget';
import { sidebarNavItems } from '../../data/demoData';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { logout } = useAuth();
  // Render a single nav link
  const renderNavItem = (item) => {
    const IconComponent = Icons[item.icon] || Icons.Circle;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-2.5 py-2.5 px-[18px] text-[13px] cursor-pointer transition-all duration-150 no-underline ${
            isActive
              ? 'bg-paper text-sage-dark font-medium border-r-2 border-sage'
              : 'text-text-muted hover:text-text-base hover:bg-paper/50'
          }`
        }
      >
        <IconComponent size={16} />
        {item.label}
      </NavLink>
    );
  };

  // Render a section label
  const renderSection = (title) => (
    <div
      key={title}
      className="text-[9px] tracking-[0.1em] uppercase text-text-light px-[18px] pt-3.5 pb-1.5"
    >
      {title}
    </div>
  );

  return (
    <aside className="w-[200px] flex-shrink-0 bg-sage-pale border-r border-card flex flex-col py-5 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-[18px] pb-5 flex items-center gap-2">
        <div className="w-[30px] h-[30px] bg-sage rounded-lg flex items-center justify-center text-base">
          🌱
        </div>
        <div>
          <div className="text-sm font-medium text-text-base">StudySprout</div>
          <div className="text-[9px] text-text-light">AI Study Assistant</div>
        </div>
      </div>

      {/* Navigation */}
      {renderSection('Main')}
      {sidebarNavItems.main.map(renderNavItem)}

      {renderSection('Study')}
      {sidebarNavItems.study.map(renderNavItem)}

      {renderSection('Progress')}
      {sidebarNavItems.progress.map(renderNavItem)}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Plant widget */}
      <div className="mx-[18px] mb-2">
        <PlantWidget />
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="flex items-center gap-2.5 py-2 px-[18px] mx-[18px] mb-4 text-[13px] font-medium text-danger hover:bg-danger-light/30 rounded-lg cursor-pointer transition-all duration-150 border-0 bg-transparent text-left"
      >
        <Icons.LogOut size={16} />
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
