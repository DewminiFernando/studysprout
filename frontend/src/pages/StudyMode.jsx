// ─── StudyMode page ───
// Flashcard-style revision: shows one question at a time with show/hide answer toggle.
// Fetches real data from the backend API.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, ChevronRight, ArrowLeft, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';

function StudyMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Fetch generated questions on load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await materialAPI.getQuestions(id);
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
  }, [id]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const goToPrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
  };

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate(`/question-bank/${id}`)}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sage-dark mb-4 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Question Bank
      </button>

      <PageHeader
        title="Study Mode"
        description="Review questions one at a time like flashcards. Show answers when you're ready."
        icon={Eye}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-paper border border-card rounded-xl mt-6">
          <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-muted">Loading questions...</p>
        </div>
      ) : error ? (
        <div className="bg-paper border border-card rounded-xl p-8 text-center flex flex-col items-center justify-center mt-6">
          <div className="w-12 h-12 bg-danger-light/30 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">{error}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-paper border border-card rounded-xl p-10 text-center flex flex-col items-center justify-center mt-6">
          <div className="w-12 h-12 bg-sage-pale text-sage rounded-full flex items-center justify-center mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="text-sm font-medium text-text-base">No Questions Available</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Please generate questions first from the Question Bank page.
          </p>
          <Button onClick={() => navigate(`/question-bank/${id}`)} className="mt-4 text-xs py-2">
            Go to Question Bank
          </Button>
        </div>
      ) : (
        <div className="mt-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-text-light font-medium">
              Question {currentIndex + 1} of {totalQuestions}
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
          <div className="w-full h-1.5 bg-cream-dark rounded-full mb-6">
            <div
              className="h-full bg-sage rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>

          {/* Flashcard */}
          <div className="bg-paper border border-card rounded-xl p-6 md:p-8 min-h-[280px] flex flex-col">
            {/* Question */}
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-sage-dark uppercase tracking-wider mb-3">
                Question
              </div>
              <p className="text-sm text-text-base leading-relaxed font-medium">
                {currentQuestion.question_text}
              </p>
            </div>

            {/* Show/Hide Answer Button */}
            <div className="mt-6 pt-4 border-t border-cream-dark">
              <Button
                variant="secondary"
                onClick={toggleAnswer}
                className="w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                {showAnswer ? (
                  <>
                    <EyeOff size={14} /> Hide Answer
                  </>
                ) : (
                  <>
                    <Eye size={14} /> Show Answer
                  </>
                )}
              </Button>

              {/* Answer + Explanation */}
              {showAnswer && (
                <div className="mt-4 bg-cream/40 border border-cream-darker/60 rounded-xl p-4 space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-sage-dark mb-1">
                      Correct Answer
                    </div>
                    <p className="text-xs text-text-base leading-relaxed font-medium">
                      {currentQuestion.correct_answer}
                    </p>
                  </div>
                  {currentQuestion.explanation && (
                    <div>
                      <div className="text-[11px] font-semibold text-sage-dark mb-1">
                        Explanation
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="secondary"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <ChevronLeft size={14} /> Previous
            </Button>

            <span className="text-[10px] text-text-light">
              {currentIndex + 1} / {totalQuestions}
            </span>

            {currentIndex < totalQuestions - 1 ? (
              <Button
                onClick={goToNext}
                className="px-4 py-2 text-xs flex items-center gap-1.5"
              >
                Next <ChevronRight size={14} />
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/question-bank/${id}`)}
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
