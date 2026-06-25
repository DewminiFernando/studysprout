// ─── MaterialPicker component ───
// Reusable material selection UI shown on QuestionBank, StudyMode, and QuizMode
// pages when no materialId is provided in the URL params.
//
// Design: cream bg, white rounded-2xl cards, border #D8E8D8, sage buttons.
// Status chips: only 'Uploaded' (always) and 'Text Extracted' (if data proves it).

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import { materialAPI } from '../services/api';

function MaterialPicker({ title, subtitle, actionLabel, targetBasePath, icon: Icon }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await materialAPI.getMaterials();
        setMaterials(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load your study materials. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const handleSelect = (material) => {
    const id = material.id || material.material_id;
    navigate(`${targetBasePath}/${id}`);
  };

  const IconComponent = Icon || FileText;

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
            <IconComponent size={19} className="text-sage" />
          </div>
          {/* Caveat for section title */}
          <h1 className="font-caveat text-2xl font-bold text-text-base">{title}</h1>
        </div>
        <p className="text-[13px] text-text-muted mt-1 ml-[52px] leading-relaxed">{subtitle}</p>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-12 flex flex-col items-center justify-center">
          <div className="w-9 h-9 border-[3px] border-sage border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-muted">Loading your study materials...</p>
        </div>

      ) : error ? (
        /* ── Error ── */
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-8 text-center flex flex-col items-center">
          <div className="w-11 h-11 bg-danger-light/40 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Something went wrong</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 text-xs py-2">
            Try Again
          </Button>
        </div>

      ) : materials.length === 0 ? (
        /* ── Empty ── */
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-10 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-sage-pale rounded-2xl flex items-center justify-center mb-4">
            <Upload size={24} className="text-sage" />
          </div>
          <h3 className="text-sm font-semibold text-text-base">No study materials yet</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Upload a PDF first to start studying.
          </p>
          <Button onClick={() => navigate('/upload-pdf')} className="mt-5 text-xs py-2.5">
            Upload PDF
          </Button>
        </div>

      ) : (
        /* ── Material cards grid ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => {
            const id = material.id || material.material_id;
            return (
              <div
                key={id}
                className="bg-white border border-[#D8E8D8] rounded-2xl p-5 flex flex-col gap-4 hover:border-sage-light transition-colors duration-200 group"
              >
                {/* Material info */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sage-pale transition-colors">
                    <FileText size={17} className="text-sage" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-text-base truncate">
                      {material.title}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5 truncate">
                      {material.original_filename}
                    </p>
                    <p className="text-[10px] text-text-light mt-1">
                      Uploaded {formatDate(material.created_at)}
                    </p>
                  </div>
                </div>

                {/* Status chips — honest only */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sage-pale text-sage font-semibold">
                    Uploaded
                  </span>
                  {material.extracted_text && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cream-dark text-text-muted font-semibold">
                      Text Extracted
                    </span>
                  )}
                </div>

                {/* Action button */}
                <Button
                  onClick={() => handleSelect(material)}
                  className="w-full text-xs py-2.5 mt-auto"
                >
                  {actionLabel}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MaterialPicker;
