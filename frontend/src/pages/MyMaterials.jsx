import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, AlertCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function MyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material? This action cannot be undone.')) {
      return;
    }
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
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <PageHeader
          title="My Study Materials"
          description="Access study guidelines and practice question banks generated from your lecture documents."
          icon={BookOpen}
        />
        <Button onClick={() => navigate('/upload-pdf')}>
          + Upload PDF
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-muted">Loading your materials...</p>
        </div>
      ) : error ? (
        <div className="bg-danger-light/20 border border-danger/20 text-danger text-sm rounded-xl p-4 flex items-center gap-3 mt-4">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
          <button onClick={fetchMaterials} className="text-xs font-semibold underline ml-auto bg-transparent border-none cursor-pointer">
            Retry
          </button>
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-paper border border-card rounded-xl p-10 text-center flex flex-col items-center justify-center mt-4">
          <div className="w-12 h-12 bg-sage-pale text-sage rounded-full flex items-center justify-center mb-3">
            <FileText size={24} />
          </div>
          <h3 className="text-sm font-medium text-text-base">No study materials yet</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Upload your lecture notes or slides in PDF format, and we'll extract the text to generate personalized study resources.
          </p>
          <Button onClick={() => navigate('/upload-pdf')} className="mt-4 text-xs py-2">
            Upload Your First PDF
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 mt-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-paper border border-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sage-light transition-colors"
            >
              {/* Left: Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-sage-dark" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-text-base truncate">{material.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5 truncate">
                    File: {material.original_filename}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Uploaded on {formatDate(material.created_at)}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/materials/${material.id}`)}
                  className="px-3 py-1.5 text-xs"
                >
                  View Text
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(material.id)}
                  disabled={deletingId === material.id}
                  className="px-3 py-1.5 text-xs text-danger hover:bg-danger-light/10 border-danger/20 hover:border-danger/30"
                >
                  {deletingId === material.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyMaterials;
