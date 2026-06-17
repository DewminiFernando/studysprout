import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function UploadPDF() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Only PDF files are allowed.');
        setFile(null);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Only PDF files are allowed.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      await materialAPI.uploadPDF(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-materials');
      }, 1500);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || 'Failed to upload and process PDF. Please try again.';
      setError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Upload Lecture PDF"
        description="Upload lecture notes, slides or transcripts in PDF format. We will extract content and automatically generate study material."
        icon={Upload}
      />

      <div className="bg-paper border border-card rounded-xl p-6 mt-4">
        {/* Upload box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all ${
            isDragging
              ? 'border-sage bg-sage-pale/40'
              : file
              ? 'border-sage-light bg-[#EAF3DE]/10'
              : 'border-cream-darker hover:border-sage-light bg-cream/30'
          }`}
        >
          {success ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#EAF3DE] text-moss rounded-full flex items-center justify-center mb-3">
                <CheckCircle size={24} />
              </div>
              <p className="text-sm font-medium text-text-base">Upload successful!</p>
              <p className="text-xs text-text-muted mt-1">Generating study guide and questions...</p>
            </div>
          ) : uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium text-text-base">Processing lecture document...</p>
              <p className="text-xs text-text-muted mt-1">Extracting text and structure</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-sage-pale text-sage-dark rounded-xl flex items-center justify-center mb-3">
                <FileText size={24} />
              </div>
              <p className="text-sm font-medium text-text-base truncate max-w-md">{file.name}</p>
              <p className="text-xs text-text-muted mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              <button
                onClick={() => {
                  setFile(null);
                  setError('');
                }}
                className="text-xs text-danger hover:underline mt-2 bg-transparent border-none cursor-pointer"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-sage-pale text-sage rounded-xl flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <p className="text-sm font-medium text-text-base">Drag & drop your lecture PDF here</p>
              <p className="text-xs text-text-muted mt-1">or click to browse from your computer</p>
              <input
                type="file"
                accept=".pdf"
                id="file-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="mt-4 bg-sage-pale text-sage-dark border border-sage-light hover:bg-sage-light px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-danger-light/20 border border-danger/20 text-danger text-xs rounded-lg p-3.5 mt-4 flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action buttons */}
        {!uploading && !success && (
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file}>
              Process PDF
            </Button>
          </div>
        )}
      </div>

      {/* Note banner */}
      <div className="bg-amber-light/30 border border-amber/20 rounded-lg p-3.5 mt-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-amber flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-text-muted leading-relaxed">
          <strong className="text-amber">Tip:</strong> PDF extraction works best with digital lecture notes and slides. Scanned documents or images may not transcribe text perfectly.
        </div>
      </div>
    </div>
  );
}

export default UploadPDF;
