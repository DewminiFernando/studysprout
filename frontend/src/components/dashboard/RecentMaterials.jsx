// ─── RecentMaterials component ───
// Shows a grid of recently uploaded study materials.

import { useNavigate } from 'react-router-dom';
import MaterialCard from '../ui/MaterialCard';
import { recentMaterials } from '../../data/demoData';

function RecentMaterials() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-medium text-text-base">
          Recent materials
        </div>
        <button
          onClick={() => navigate('/materials')}
          className="text-[11px] text-sage-dark cursor-pointer hover:underline bg-transparent border-none"
        >
          See all →
        </button>
      </div>

      {/* Materials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {recentMaterials.slice(0, 2).map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
}

export default RecentMaterials;
