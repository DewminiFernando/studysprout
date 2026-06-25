// ─── MaterialDetail page (Learning Workspace) ───
// Shows material info, next-step action cards, and extracted text.
// Section titles use Caveat; body text uses Nunito; no box shadows.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, ArrowLeft, AlertCircle, BookMarked,
  ListChecks, Eye, Pencil, ChevronRight,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await materialAPI.getMaterialById(id);
        setMaterial(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || 'Failed to load material details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  // Action cards — primary ones first (filled sage), secondary ones last (outline)
  const ACTION_CARDS = [
    {
      icon:        Eye,
      title:       'Study Mode',
      description: 'Revise answers and explanations before testing.',
      buttonLabel: 'Start Studying',
      route:       `/study-mode/${id}`,
      variant:     'primary',
    },
    {
      icon:        Pencil,
      title:       'Practice Quiz',
      description: 'Answer questions and get semantic AI feedback.',
      buttonLabel: 'Take Quiz',
      route:       `/quiz/${id}`,
      variant:     'primary',
    },
    {
      icon:        BookMarked,
      title:       'Study Guideline',
      description: 'Review the AI-generated study plan.',
      buttonLabel: 'Open Guide',
      route:       `/study-guideline/${id}`,
      variant:     'secondary',
    },
    {
      icon:        ListChecks,
      title:       'Question Bank',
      description: 'View all generated practice questions.',
      buttonLabel: 'View Questions',
      route:       `/question-bank/${id}`,
      variant:     'secondary',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/my-materials')}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-sage font-semibold transition-colors bg-transparent border-none cursor-pointer mb-4"
      >
        <ArrowLeft size={14} /> Back to Materials
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#D8E8D8] rounded-2xl">
          <div className="w-9 h-9 border-[3px] border-sage border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-muted">Loading content...</p>
        </div>

      ) : error ? (
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-danger-light/40 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error loading material</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm">{error}</p>
          <Button onClick={() => navigate('/my-materials')} className="mt-4 text-xs py-2">
            Back to My Materials
          </Button>
        </div>

      ) : (
        <div className="space-y-5">
          {/* ── Top info card ── */}
          <div className="bg-white border border-[#D8E8D8] rounded-2xl p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={21} className="text-sage" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-text-base truncate">{material.title}</h1>
                <p className="text-xs text-text-muted mt-0.5 truncate">{material.original_filename}</p>
                <p className="text-[10px] text-text-light mt-1">
                  Uploaded on {new Date(material.created_at).toLocaleString()}
                </p>
                {/* Honest status chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sage-pale text-sage font-semibold">
                    Uploaded
                  </span>
                  {material.extracted_text && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cream-dark text-text-muted font-semibold">
                      Text Extracted
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── What would you like to do next? ── */}
          <div>
            {/* Caveat on section heading */}
            <h2 className="font-caveat text-xl font-bold text-text-base mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-sage rounded-full inline-block" />
              What would you like to do next?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACTION_CARDS.map((card) => {
                const IconComp = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white border border-[#D8E8D8] rounded-2xl p-4 flex flex-col gap-3 hover:border-sage-light transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sage-pale transition-colors">
                        <IconComp size={16} className="text-sage" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-text-base">{card.title}</h3>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{card.description}</p>
                      </div>
                    </div>
                    <Button
                      variant={card.variant}
                      onClick={() => navigate(card.route)}
                      className="w-full text-xs py-2 flex items-center justify-center gap-1.5 mt-auto"
                    >
                      {card.buttonLabel}
                      <ChevronRight size={12} />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Extracted Document Text ── */}
          <div className="bg-white border border-[#D8E8D8] rounded-2xl p-5 md:p-6">
            <h3 className="font-caveat text-xl font-bold text-text-base mb-3 flex items-center gap-2">
              <FileText size={16} className="text-sage" />
              Extracted Document Text
            </h3>
            <div className="bg-cream/60 border border-[#D8E8D8] rounded-xl p-4 md:p-5 text-sm text-text-base whitespace-pre-wrap font-sans leading-relaxed max-h-[600px] overflow-y-auto">
              {material.extracted_text || (
                <span className="text-text-muted italic">No text extracted from this material.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialDetail;
