// ─── StudyGuideline page ───
// Renders the AI-generated study guidelines for a lecture PDF.
// Fetches real data from the backend API.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function StudyGuideline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guideline, setGuideline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing guideline on load
  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await materialAPI.getGuideline(id);
        setGuideline(response.data);
      } catch (err) {
        // 404 means no guideline generated yet — not an error
        if (err.response?.status === 404) {
          setGuideline(null);
        } else {
          setError(err.response?.data?.detail || 'Failed to load study guideline.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuideline();
  }, [id]);

  // Generate guideline
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await materialAPI.generateGuideline(id);
      setGuideline(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate study guideline. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Helper to render a section card
  const renderSection = (title, items, icon) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="bg-paper border border-card rounded-xl p-5 hover:border-sage-light transition-colors">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cream-dark">
          <Sparkles size={16} className="text-sage" />
          <h2 className="text-sm font-semibold text-text-base">{title}</h2>
        </div>
        <ul className="space-y-2.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-text-muted leading-relaxed">
              <span className="text-sage-dark mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate(`/materials/${id}`)}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sage-dark mb-4 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Material
      </button>

      <PageHeader
        title="Study Guideline"
        description="Structured study guide extracted and organized by AI from your lecture notes."
        icon={BookOpen}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-paper border border-card rounded-xl mt-6">
          <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-muted">Loading study guideline...</p>
        </div>
      ) : error ? (
        <div className="bg-paper border border-card rounded-xl p-8 text-center flex flex-col items-center justify-center mt-6">
          <div className="w-12 h-12 bg-danger-light/30 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">{error}</p>
          <Button onClick={handleGenerate} className="mt-4 text-xs py-2" disabled={generating}>
            {generating ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      ) : !guideline ? (
        <div className="bg-paper border border-card rounded-xl p-10 text-center flex flex-col items-center justify-center mt-6">
          <div className="w-12 h-12 bg-sage-pale text-sage rounded-full flex items-center justify-center mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="text-sm font-medium text-text-base">No Study Guideline Yet</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Click the button below to generate an AI-powered study guideline from your uploaded PDF.
          </p>
          <Button onClick={handleGenerate} className="mt-4 text-xs py-2" disabled={generating}>
            {generating ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Generating...
              </span>
            ) : (
              'Generate Study Guideline'
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Generate / Regenerate button */}
          <div className="flex justify-end mt-2 mb-4">
            <Button
              variant="secondary"
              onClick={handleGenerate}
              disabled={generating}
              className="text-xs py-1.5 px-3"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Regenerating...
                </span>
              ) : (
                '↻ Regenerate Guideline'
              )}
            </Button>
          </div>

          {/* Guideline sections */}
          <div className="space-y-4">
            {/* PDF Overview */}
            {guideline.overview && (
              <div className="bg-paper border border-card rounded-xl p-5 hover:border-sage-light transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cream-dark">
                  <Sparkles size={16} className="text-sage" />
                  <h2 className="text-sm font-semibold text-text-base">PDF Overview</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{guideline.overview}</p>
              </div>
            )}

            {renderSection('Key Topics', guideline.key_topics)}
            {renderSection('Suggested Study Order', guideline.study_order)}
            {renderSection('Important Definitions', guideline.important_definitions)}
            {renderSection('Exam-Focused Areas', guideline.exam_focused_areas)}
            {renderSection('Revision Tips', guideline.revision_tips)}
          </div>

          {/* Action footer */}
          <div className="flex justify-between items-center bg-cream-dark/50 border border-card rounded-xl p-4 mt-6">
            <div>
              <h4 className="text-xs font-semibold text-text-base">Ready to test your knowledge?</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Start a practice quiz based on this study guide.</p>
            </div>
            <Button onClick={() => navigate(`/question-bank/${id}`)}>
              View Question Bank
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default StudyGuideline;
