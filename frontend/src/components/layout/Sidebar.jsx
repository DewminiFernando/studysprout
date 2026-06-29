// ─── Sidebar component ───
// Left navigation: logo, nav sections, plant widget, logout.
// Background: #4A7558 (--ss-sidebar). All text is white/translucent.
// Active nav item: rgba(255,255,255,0.15) bg + 2px right border #C8934A.

import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import PlantWidget from '../ui/PlantWidget';
import { useAuth } from '../../context/AuthContext';

const SIDEBAR_NAV = {
  main: [
    { label: 'Dashboard',    icon: 'LayoutDashboard', path: '/dashboard' },
    { label: 'Upload PDF',   icon: 'Upload',          path: '/upload-pdf' },
    { label: 'My Materials', icon: 'BookOpen',         path: '/my-materials' },
  ],
  study: [
    { label: 'Question Bank', icon: 'ListChecks', path: '/question-bank' },
    { label: 'Quiz Mode',     icon: 'Pencil',     path: '/quiz' },
    { label: 'Study Mode',    icon: 'Eye',        path: '/study-mode' },
  ],
  progress: [
    { label: 'Analytics', icon: 'BarChart3', path: '/analytics' },
    { label: 'My Plant',  icon: 'Leaf',      path: '/plant-progress' },
  ],
};

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: '9px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
        padding: '14px 14px 5px',
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

function NavItem({ item }) {
  const IconComponent = Icons[item.icon] || Icons.Circle;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-2 no-underline transition-all duration-150 ${
          isActive ? 'ss-nav-active' : 'ss-nav-idle'
        }`
      }
      style={({ isActive }) => ({
        fontSize: '12.5px',
        minHeight: '34px',
        padding: '7px 14px',
        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
        background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
        borderRight: isActive ? '2px solid #C8934A' : '2px solid transparent',
        fontWeight: isActive ? 500 : 400,
      })}
    >
      {({ isActive }) => (
        <>
          <IconComponent
            size={14}
            style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)', flexShrink: 0 }}
          />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside
      style={{
        width: '168px',
        background: 'var(--ss-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* ── Logo ── */}
      <div style={{ padding: '16px 14px 12px' }}>
        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontWeight: 700,
            fontSize: '20px',
            color: '#FFFFFF',
            lineHeight: 1.1,
          }}
        >
          🌱 StudySprout
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '2px',
            letterSpacing: '0.02em',
          }}
        >
          AI Study Assistant
        </div>
      </div>

      {/* ── Navigation ── */}
      <SectionLabel>Main</SectionLabel>
      {SIDEBAR_NAV.main.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      <SectionLabel>Study</SectionLabel>
      {SIDEBAR_NAV.study.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      <SectionLabel>Progress</SectionLabel>
      {SIDEBAR_NAV.progress.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Plant widget ── */}
      <div style={{ margin: '0 10px 8px' }}>
        <PlantWidget />
      </div>

      {/* ── Logout ── */}
      <button
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 10px 14px',
          padding: '7px 10px',
          background: 'rgba(226,75,74,0.18)',
          border: 'none',
          borderRadius: '8px',
          color: '#FFB3B3',
          fontSize: '12.5px',
          cursor: 'pointer',
          transition: 'background 150ms',
          fontFamily: 'DM Sans, sans-serif',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(226,75,74,0.28)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(226,75,74,0.18)')}
      >
        <Icons.LogOut size={14} />
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
