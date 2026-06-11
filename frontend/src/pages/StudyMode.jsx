// ─── StudyMode page ───
// Allows interactive study of guides, highlights, and flashcard practice.

import { useState } from 'react';
import { Eye, BookOpen, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { sampleStudyGuide } from '../data/demoData';

function StudyMode() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Study Mode"
        description="Review study content interactively and practice core concepts step-by-step."
        icon={Eye}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Left Side: Topic Navigation */}
        <div className="md:col-span-1 bg-paper border border-card rounded-xl p-4 space-y-2 h-fit">
          <div className="text-[11px] font-semibold text-text-light uppercase tracking-wider mb-2">
            Lecture Sections
          </div>
          {sampleStudyGuide.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-center justify-between border cursor-pointer ${
                activeSection === index
                  ? 'bg-sage-pale border-sage-light text-sage-dark font-medium'
                  : 'bg-transparent border-transparent text-text-muted hover:bg-cream/50'
              }`}
            >
              <span>{section.heading}</span>
              <ChevronRight size={14} className={activeSection === index ? 'text-sage-dark' : 'text-text-light'} />
            </button>
          ))}
        </div>

        {/* Right Side: Detailed Section view */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-paper border border-card rounded-xl p-5 min-h-[300px] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-cream-dark mb-4">
              <Sparkles size={18} className="text-sage" />
              <h2 className="text-sm font-semibold text-text-base">
                {sampleStudyGuide.sections[activeSection].heading}
              </h2>
            </div>

            {/* Bullet points */}
            <div className="flex-1">
              <ul className="space-y-4">
                {sampleStudyGuide.sections[activeSection].points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs text-text-muted leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-sage-pale text-sage-dark flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-cream-dark">
              <span className="text-[10px] text-text-light">
                Section {activeSection + 1} of {sampleStudyGuide.sections.length}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setActiveSection((prev) => Math.max(0, prev - 1))
                  }
                  disabled={activeSection === 0}
                  className="px-3 py-1.5 text-xs"
                >
                  Previous
                </Button>
                {activeSection < sampleStudyGuide.sections.length - 1 ? (
                  <Button
                    onClick={() =>
                      setActiveSection((prev) =>
                        Math.min(sampleStudyGuide.sections.length - 1, prev + 1)
                      )
                    }
                    className="px-3 py-1.5 text-xs"
                  >
                    Next Section
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/quiz')}
                    className="px-3 py-1.5 text-xs"
                  >
                    Try Quiz Mode
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyMode;
