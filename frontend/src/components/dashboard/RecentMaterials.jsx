// ─── RecentMaterials component ───
// Shows a grid of recently uploaded study materials.

import { useNavigate } from 'react-router-dom';
import MaterialCard from '../ui/MaterialCard';

function RecentMaterials({ materials }) {
  const navigate = useNavigate();
  const displayMaterials = materials || [];

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-medium text-text-base">
          Recent materials
        </div>
        {displayMaterials.length > 0 && (
          <button
            onClick={() => navigate('/my-materials')}
            className="text-[11px] text-sage-dark cursor-pointer hover:underline bg-transparent border-none"
          >
            See all →
          </button>
        )}
      </div>

      {/* Materials grid */}
      {displayMaterials.length === 0 ? (
        <div className="text-center py-6 bg-cream/10 rounded-xl border border-dashed border-cream-darker/40 text-xs text-text-muted">
          No materials uploaded yet. 🌱 Get started by uploading a PDF!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {displayMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentMaterials;
