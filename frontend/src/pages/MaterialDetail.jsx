import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/my-materials')}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-sage-dark font-medium transition-colors bg-transparent border-none cursor-pointer mb-2"
        >
          <ArrowLeft size={14} />
          Back to Materials
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-paper border border-card rounded-xl">
          <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-muted">Extracting and loading content...</p>
        </div>
      ) : error ? (
        <div className="bg-paper border border-card rounded-xl p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-danger-light/30 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error loading material</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">{error}</p>
          <Button onClick={() => navigate('/my-materials')} className="mt-4 text-xs py-2">
            Back to My Materials
          </Button>
        </div>
      ) : (
        <div className="bg-paper border border-card rounded-xl p-6 md:p-8">
          <div className="border-b border-cream-dark pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-sage-dark" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-xl font-bold text-text-base truncate">{material.title}</h1>
                  <p className="text-xs text-text-muted mt-0.5 truncate">
                    Original File: {material.original_filename}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                <Button variant="secondary" onClick={() => navigate(`/study-guideline/${id}`)} className="px-3 py-1.5 text-xs">
                  Study Guideline
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/question-bank/${id}`)} className="px-3 py-1.5 text-xs">
                  Question Bank
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/study-mode/${id}`)} className="px-3 py-1.5 text-xs">
                  Study Mode
                </Button>
                <Button variant="secondary" onClick={() => navigate('/quiz-mode', { state: { materialId: id } })} className="px-3 py-1.5 text-xs">
                  Practice Quiz
                </Button>
                <Button variant="ghost" onClick={() => navigate('/my-materials')} className="px-3 py-1.5 text-xs">
                  Close View
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              Uploaded on {new Date(material.created_at).toLocaleString()}
            </p>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-sm font-semibold text-text-base mb-3 border-b border-cream pb-1">Extracted Document Text</h3>
            <div className="bg-cream/40 border border-cream-darker/60 rounded-xl p-4 md:p-6 text-sm text-text-base whitespace-pre-wrap font-sans leading-relaxed max-h-[600px] overflow-y-auto">
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
