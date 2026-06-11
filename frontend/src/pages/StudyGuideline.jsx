// ─── StudyGuideline page ───
// Renders the AI-generated study guidelines for a lecture PDF.

import { BookOpen, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { sampleStudyGuide } from '../data/demoData';

function StudyGuideline() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/materials')}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sage-dark mb-4 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to My Materials
      </button>

      <PageHeader
        title={sampleStudyGuide.title}
        description="Structured study guide extracted and organized by AI from your lecture notes."
        icon={BookOpen}
      />

      <div className="space-y-4 mt-6">
        {sampleStudyGuide.sections.map((section, index) => (
          <div
            key={index}
            className="bg-paper border border-card rounded-xl p-5 hover:border-sage-light transition-colors"
          >
            {/* Heading */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cream-dark">
              <Sparkles size={16} className="text-sage" />
              <h2 className="text-sm font-semibold text-text-base">{section.heading}</h2>
            </div>

            {/* Bullet points */}
            <ul className="space-y-2.5">
              {section.points.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5 text-xs text-text-muted leading-relaxed">
                  <span className="text-sage-dark mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Action footer */}
      <div className="flex justify-between items-center bg-cream-dark/50 border border-card rounded-xl p-4 mt-6">
        <div>
          <h4 className="text-xs font-semibold text-text-base">Ready to test your knowledge?</h4>
          <p className="text-[10px] text-text-muted mt-0.5">Start a practice quiz based on this study guide.</p>
        </div>
        <Button onClick={() => navigate('/quiz')}>
          Take Practice Quiz
        </Button>
      </div>
    </div>
  );
}

export default StudyGuideline;
