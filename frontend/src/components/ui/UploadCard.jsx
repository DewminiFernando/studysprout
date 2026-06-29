// ─── UploadCard component ───
// Upload zone with reward preview row above (spec §9).
// Dashed border zone, hover bg/border change, 3-item reward preview.

import { CloudUpload, FileText, MessageSquare, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UploadCard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = [false, () => {}];

  return (
    <div style={{ marginBottom: '14px' }}>
      {/* Reward preview row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <RewardItem icon={FileText} iconColor="#4A7558" bg="#EAF2EC" text="Unlock study guide" />
        <RewardItem icon={MessageSquare} iconColor="#4A7558" bg="#EAF2EC" text="Generate questions" />
        <RewardItem icon={Zap} iconColor="#C8934A" bg="#FFF3E0" text="+10 XP on upload" amber />
      </div>

      {/* Upload zone */}
      <UploadZone navigate={navigate} />
    </div>
  );
}

function RewardItem({ icon: Icon, iconColor, bg, text, amber }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: '8px',
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <Icon size={14} style={{ color: iconColor, flexShrink: 0 }} />
      <span
        style={{
          fontSize: '11px',
          color: amber ? '#7A4F00' : '#3B6D11',
          fontWeight: 400,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function UploadZone({ navigate }) {
  const handleHover = (el, on) => {
    if (!el) return;
    el.style.borderColor = on ? '#4A7558' : '#C5D8CA';
    el.style.background  = on ? '#EAF2EC' : 'transparent';
  };

  return (
    <div
      style={{
        border: '1.5px dashed #C5D8CA',
        borderRadius: '10px',
        padding: '18px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 150ms, background 150ms',
      }}
      onMouseEnter={(e) => handleHover(e.currentTarget, true)}
      onMouseLeave={(e) => handleHover(e.currentTarget, false)}
      onClick={() => navigate('/upload-pdf')}
    >
      <CloudUpload
        size={24}
        style={{ color: '#4A7558', marginBottom: '6px' }}
      />
      <div
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--ss-text)',
          marginBottom: '3px',
        }}
      >
        Upload a lecture PDF
      </div>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--ss-muted)',
          marginBottom: '10px',
        }}
      >
        We'll auto-generate a study guide + question bank
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); navigate('/upload-pdf'); }}
        style={{
          background: '#4A7558',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 20px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Choose file
      </button>
    </div>
  );
}

export default UploadCard;
