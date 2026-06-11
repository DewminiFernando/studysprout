// ─── UploadCard component ───
// CTA card prompting users to upload a new PDF.

import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UploadCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-cream border-[1.5px] border-dashed border-sage-light rounded-xl p-4 flex items-center gap-3.5">
      {/* Upload icon */}
      <div className="w-10 h-10 bg-sage-pale rounded-[10px] flex items-center justify-center flex-shrink-0">
        <Upload size={20} className="text-sage" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text-base">
          Upload a new lecture PDF
        </div>
        <div className="text-[11px] text-text-muted mt-0.5">
          We'll generate a study guide + question bank automatically
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate('/upload')}
        className="ml-auto bg-sage text-white border-none px-4 py-2 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap hover:bg-sage-dark transition-colors"
      >
        + Upload PDF
      </button>
    </div>
  );
}

export default UploadCard;
