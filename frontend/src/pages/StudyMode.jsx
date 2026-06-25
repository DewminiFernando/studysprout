// ─── StudyMode page ───
// Flashcard-style revision: shows one question at a time with show/hide answer toggle.
// Fetches real data from the backend API.
// Shows MaterialPicker when no materialId is provided in the URL.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, ChevronLeft, ChevronRight, ArrowLeft, AlertCircle, BookOpen,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MaterialPicker from '../components/MaterialPicker';
import { materialAPI } from '../services/api';

function StudyMode() {
  const { id } = useParams();
  const materialId = id;
  const navigate = useNavigate();

  const [questions,     setQuestions]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [showAnswer,    setShowAnswer]    = useState(false);

  useEffect(() => {
    if (!materialId) return;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await materialAPI.getQuestions(materialId);
        setQuestions(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setQuestions([]);
        } else {
          setError(err.response?.data?.detail || 'Failed to load questions.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [materialId]);

  const currentQuestion = questions[currentIndex];
  const total           = questions.length;

  const goToPrevious = () => { setShowAnswer(false); setCurrentIndex((p) => Math.max(0, p - 1)); };
  const goToNext     = () => { setShowAnswer(false); setCurrentIndex((p) => Math.min(total - 1, p + 1)); };
  const toggleAnswer = () => setShowAnswer((p) => !p);

  // ── No materialId → material picker ──
  if (!materialId) {
    return (
      <MaterialPicker
        title="Choose a Material to Study"
        subtitle="Select a PDF to revise answers, explanations, and key topics."
        actionLabel="Start Study Mode"
        targetBasePath="/study-mode"
        icon={Eye}
      />
    );
  }

  // ── Has materialId → flashcard study mode ──
  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate(`/question-bank/${materialId}`)}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sage font-semibold mb-4 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={13} /> Back to Question Bank
      </button>

      <PageHeader
        title="Study Mode"
        description="Review questions one at a time like flashcards. Show answers when you're ready."
        icon={Eye}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#D8E8D8] rounded-2xl mt-6">
          <div className="w-9 h-9 border-[3px] border-sage border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-muted">Loading questions...</p>
        </div>

      ) : error ? (
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-8 text-center flex flex-col items-center mt-6">
          <div className="w-11 h-11 bg-danger-light/40 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={22} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm">{error}</p>
        </div>

      ) : questions.length === 0 ? (
        <div className="bg-white border border-[#D8E8D8] rounded-2xl p-10 text-center flex flex-col items-center mt-6">
          <div className="w-12 h-12 bg-sage-pale rounded-full flex items-center justify-center mb-3">
            <BookOpen size={22} className="text-sage" />
          </div>
          <h3 className="text-sm font-semibold text-text-base">No Questions Available</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Please generate questions first from the Question Bank page.
          </p>
          <Button onClick={() => navigate(`/question-bank/${materialId}`)} className="mt-5 text-xs py-2">
            Go to Question Bank
          </Button>
        </div>

      ) : (
        <div className="mt-6">
          {/* Progress row — DM Mono for X/Y numbers */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-text-light font-medium">
              Question{' '}
              <span className="font-dm-mono text-text-muted font-semibold">{currentIndex + 1}</span>
              {' of '}
              <span className="font-dm-mono text-text-muted font-semibold">{total}</span>
            </span>
            <div className="flex items-center gap-2">
              {currentQuestion.topic && (
                <Badge variant="default">{currentQuestion.topic}</Badge>
              )}
              <Badge variant={currentQuestion.difficulty || 'default'}>
                {currentQuestion.difficulty || 'N/A'}
              </Badge>
              <Badge variant="info">{currentQuestion.question_type}</Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-cream-dark rounded-full mb-5">
            <div
              className="h-full bg-sage rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>

          {/* Flashcard */}
          <div className="bg-white border border-[#D8E8D8] rounded-2xl p-6 md:p-8 min-h-[280px] flex flex-col">
            <div className="flex-1">
              <div className="text-[11px] font-bold text-sage uppercase tracking-wider mb-3">
                Question
              </div>
              <p className="text-sm text-text-base leading-relaxed font-semibold">
                {currentQuestion.question_text}
              </p>
            </div>

            {/* Show/Hide answer */}
            <div className="mt-6 pt-4 border-t border-[#D8E8D8]">
              <Button
                variant="secondary"
                onClick={toggleAnswer}
                className="w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                {showAnswer
                  ? <><EyeOff size={13} /> Hide Answer</>
                  : <><Eye size={13} />     Show Answer</>}
              </Button>

              {showAnswer && (
                <div className="mt-4 bg-cream/50 border border-[#D8E8D8] rounded-xl p-4 space-y-3">
                  <div>
                    <div className="text-[11px] font-bold text-sage mb-1">Correct Answer</div>
                    <p className="text-xs text-text-base leading-relaxed font-semibold">
                      {currentQuestion.correct_answer}
                    </p>
                  </div>
                  {currentQuestion.explanation && (
                    <div>
                      <div className="text-[11px] font-bold text-sage mb-1">Explanation</div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="secondary"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <ChevronLeft size={13} /> Previous
            </Button>

            <span className="text-[10px] text-text-light font-dm-mono">
              {currentIndex + 1} / {total}
            </span>

            {currentIndex < total - 1 ? (
              <Button onClick={goToNext} className="px-4 py-2 text-xs flex items-center gap-1.5">
                Next <ChevronRight size={13} />
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/question-bank/${materialId}`)}
                className="px-4 py-2 text-xs"
              >
                Finish Review
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyMode;
