// ─── MyMaterials page ───
// Lists all uploaded lecture PDFs with options to study, quiz or delete.

import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { recentMaterials } from '../data/demoData';

function MyMaterials() {
  const navigate = useNavigate();

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

      <div className="grid grid-cols-1 gap-3 mt-4">
        {recentMaterials.map((material) => (
          <div
            key={material.id}
            className="bg-paper border border-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sage-light transition-colors"
          >
            {/* Left: Info */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-sage-pale rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-sage-dark" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-base">{material.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {material.questions} exam-style questions · {material.week}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <span className="font-semibold text-sage-dark">Last Score:</span>
                    <span>{material.lastScore}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        material.statusType === 'done'
                          ? 'bg-[#EAF3DE] text-moss'
                          : 'bg-amber-light text-amber'
                      }`}
                    >
                      {material.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Progress */}
            <div className="w-full md:w-36 flex flex-col justify-center">
              <div className="flex justify-between text-[10px] text-text-muted mb-1">
                <span>Completions</span>
                <span>{material.progress}%</span>
              </div>
              <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-sage rounded-full"
                  style={{ width: `${material.progress}%` }}
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/study-guideline`)}
                className="px-3 py-1.5 text-xs"
              >
                Study Guide
              </Button>
              <Button
                onClick={() => navigate(`/quiz-mode`)}
                className="px-3 py-1.5 text-xs"
              >
                Quiz Practice
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyMaterials;
