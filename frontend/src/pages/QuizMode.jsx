// ─── QuizMode page ───
// Dynamic practice quizzes with semantic evaluation on submission.

import { useState, useEffect } from 'react';
import { Pencil, ArrowRight, HelpCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function QuizMode() {
  const { fetchPlantProgress } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve materialId from navigation state (or fallback to id if provided)
  const materialId = location.state?.materialId || location.state?.id;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'answer text' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!materialId) {
      setLoading(false);
      setError('No study material selected. Please select a material to start a quiz.');
      return;
    }

    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        // Start quiz for selected material with default limit of 10
        const response = await quizAPI.startQuiz({
          material_id: parseInt(materialId),
          limit: 10,
        });
        setQuestions(response.data.questions || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail ||
            'Failed to start quiz. Please ensure questions are generated for this material first.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [materialId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (questions.length === 0) return;

    try {
      setSubmitting(true);
      setError('');

      // Format answers as list of { question_id, student_answer }
      const formattedAnswers = questions.map((q) => ({
        question_id: q.id,
        student_answer: answers[q.id] || '',
      }));

      // Call API submit quiz
      const response = await quizAPI.submitQuiz({
        material_id: parseInt(materialId),
        answers: formattedAnswers,
      });

      // Update plant progress in sidebar widget
      fetchPlantProgress();

      // Navigate to Results page, passing the backend response
      navigate('/results', {
        state: { quizResult: response.data },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 'An error occurred during submission. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center py-20 bg-paper border border-card rounded-xl">
          <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-muted">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-paper border border-card rounded-xl p-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-danger-light/30 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error Loading Quiz</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">{error}</p>
          <Button onClick={() => navigate('/my-materials')} className="mt-4 text-xs py-2">
            Go to My Materials
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const currentAnswer = answers[currentQuestion?.id] || '';

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Practice Quiz"
        description="Write answers to practice questions. Our AI evaluates semantic similarity to provide immediate feedback on submission."
        icon={Pencil}
      />

      {error && (
        <div className="bg-danger-light/20 border border-danger/20 text-danger text-xs rounded-xl p-3.5 flex items-center gap-3 mt-4 mb-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-paper border border-card rounded-xl overflow-hidden mt-6 shadow-sm">
        {/* Quiz Panel Header */}
        <div className="bg-sage-pale px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text-base">StudySprout Quiz Mode</div>
            <div className="text-[10px] text-text-muted mt-0.5">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <Badge variant="mcq">{currentQuestion?.question_type || 'Short Answer'}</Badge>
        </div>

        {/* Quiz Panel Body */}
        <div className="p-4 md:p-6">
          {/* Progress bar */}
          <div className="h-1 bg-cream-dark rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-sage rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question */}
          <div className="flex items-start gap-2.5 mb-4">
            <HelpCircle size={16} className="text-sage mt-0.5 flex-shrink-0" />
            <h2 className="text-xs md:text-sm font-medium text-text-base leading-relaxed">
              {currentQuestion?.question_text}
            </h2>
          </div>

          {/* Topic and Difficulty badges */}
          <div className="flex gap-2 mb-4">
            {currentQuestion?.topic && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream-dark text-text-muted">
                Topic: {currentQuestion.topic}
              </span>
            )}
            {currentQuestion?.difficulty && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream-dark text-text-muted">
                Difficulty: {currentQuestion.difficulty}
              </span>
            )}
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <textarea
              rows={4}
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your explanation here..."
              disabled={submitting}
              className="w-full p-3 bg-cream border border-cream-darker rounded-lg text-xs text-text-base placeholder:text-text-light focus:outline-none focus:border-sage disabled:bg-cream/40 disabled:text-text-muted transition-colors resize-none font-sans"
            />

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleAnswerChange(
                      currentQuestion.id,
                      `This is a sample student answer explanation about ${currentQuestion.topic || 'the topic'} to verify semantic similarity checkers.`
                    )
                  }
                  className="bg-transparent border border-cream-darker text-text-muted text-[11px] px-3.5 py-1.5 rounded-lg cursor-pointer hover:bg-cream/50 transition-colors"
                >
                  Fill Demo Answer
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={currentQuestionIndex === 0 || submitting}
                  onClick={handlePrev}
                  className="px-3 py-1.5 text-xs flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Back
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Quiz <ArrowRight size={14} />
                      </>
                    )}
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

export default QuizMode;
