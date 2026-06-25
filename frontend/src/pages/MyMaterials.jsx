// ─── MyMaterials page (Study Materials Hub) ───
// Rich material cards with full study workflow action buttons.
// Title uses Caveat; all card text uses Nunito; honest status chips only.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, FileText, AlertCircle, BookMarked,
  ListChecks, Eye, Pencil, Trash2, Upload,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function MyMaterials() {
  const [materials, setMaterials]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await materialAPI.getMaterials();
      setMaterials(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load study materials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material? This action cannot be undone.')) return;
    try {
      setDeletingId(id);
      await materialAPI.deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to delete material.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex justify-between items-start mb-6">
        <div>
          {/* Caveat for page title */}
          <h1 className="font-caveat text-3xl font-bold text-text-base">My Study Materials</h1>
          <p className="text-sm text-text-muted mt-1">
            Access your uploaded PDFs, generate study content, and continue practicing.
          </p>
        </div>
        <Button onClick={() => navigate('/upload-pdf')} className="flex items-center gap-1.5 text-xs py-2.5 px-4 flex-shrink-0">
          <Upload size={14} />
          Upload PDF
        </Button>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-9 h-9 border-[3px] border-sage border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-muted">Loading your materials...</p>
        </div>

      ) : error ? (
        <div className="bg-white border border-[#D8E8D8] text-danger text-sm rounded-2xl p-4 flex items-center gap-3 mt-2">
          <AlertCircle size={17} className="flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchMaterials}
            className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer text-sage"
          >
            Retry
          </button>
        </div>

      ) : materials.length === 0 ? (
        /* ── Empty state ── */
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-10 text-center flex flex-col items-center mt-2">
          <div className="w-14 h-14 bg-sage-pale rounded-2xl flex items-center justify-center mb-4">
            <FileText size={24} className="text-sage" />
          </div>
          <h3 className="text-base font-semibold text-text-base">No study materials yet</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
            Upload your lecture notes or slides in PDF format, and we'll extract the text to generate personalised study resources.
          </p>
          <Button onClick={() => navigate('/upload-pdf')} className="mt-5 text-xs py-2.5">
            Upload Your First PDF
          </Button>
        </div>

      ) : (
        /* ── Material cards ── */
        <div className="flex flex-col gap-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-white border border-[#D8E8D8] rounded-2xl p-5 hover:border-sage-light transition-colors duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* ── Left: info ── */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={21} className="text-sage" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-text-base truncate">{material.title}</h3>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{material.original_filename}</p>
                    <p className="text-[10px] text-text-light mt-1">Uploaded {formatDate(material.created_at)}</p>

                    {/* Honest status chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
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

                {/* ── Right: actions ── */}
                <div className="flex flex-col gap-2 lg:items-end flex-shrink-0">
                  {/* Top row — all 4 workflow buttons on one line */}
                  <div className="flex flex-nowrap justify-end gap-1.5">
                    <Button
                      onClick={() => navigate(`/study-mode/${material.id}`)}
                      className="text-[10px] px-2 py-1 rounded-lg whitespace-nowrap gap-1 flex items-center"
                    >
                      <Eye className="w-3 h-3 flex-shrink-0" /> Study Mode
                    </Button>
                    <Button
                      onClick={() => navigate(`/quiz/${material.id}`)}
                      className="text-[10px] px-2 py-1 rounded-lg whitespace-nowrap gap-1 flex items-center"
                    >
                      <Pencil className="w-3 h-3 flex-shrink-0" /> Practice Quiz
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/study-guideline/${material.id}`)}
                      className="text-[10px] px-2 py-1 rounded-lg whitespace-nowrap gap-1 flex items-center"
                    >
                      <BookMarked className="w-3 h-3 flex-shrink-0" /> Study Guide
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/question-bank/${material.id}`)}
                      className="text-[10px] px-2 py-1 rounded-lg whitespace-nowrap gap-1 flex items-center"
                    >
                      <ListChecks className="w-3 h-3 flex-shrink-0" /> Question Bank
                    </Button>
                  </div>

                  {/* Bottom row — secondary / ghost actions */}
                  <div className="flex flex-nowrap justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/materials/${material.id}`)}
                      className="text-[10px] px-2 py-1 rounded-lg whitespace-nowrap gap-1 flex items-center text-text-light border-cream-dark hover:border-[#B8D4C0] hover:text-sage"
                    >
                      <FileText className="w-3 h-3 flex-shrink-0" /> Read Extracted Text
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(material.id)}
                      disabled={deletingId === material.id}
                      className="text-[10px] px-2 py-1 rounded-lg whitespace-nowrap gap-1 flex items-center text-danger border-danger/20 hover:bg-danger-light/10 hover:border-danger/30"
                    >
                      <Trash2 className="w-3 h-3 flex-shrink-0" />
                      {deletingId === material.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyMaterials;
