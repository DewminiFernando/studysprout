// ─── QuizMode page ───
// Interactive practice quizzes with semantic evaluation simulation.

import { useState } from 'react';
import { Pencil, Check, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { sampleQuiz } from '../data/demoData';

function QuizMode() {
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    // Simulate calling sentence-transformers / similarity check API
    // Calculate a score based on word length or predefined match rules
    const hasReduction = userAnswer.toLowerCase().includes('redu') || userAnswer.toLowerCase().includes('duplicat');
    const hasConsistency = userAnswer.toLowerCase().includes('consist') || userAnswer.toLowerCase().includes('integr');

    let score = 0.35;
    if (hasReduction && hasConsistency) {
      score = 0.86;
    } else if (hasReduction || hasConsistency) {
      score = 0.58;
    }

    setSimilarityScore(score);
    setSubmitted(true);

    if (score >= 0.75) {
      setFeedbackMsg('Normalization organizes data to reduce redundancy and improve integrity. Your answer captures the core meaning well.');
    } else if (score >= 0.50) {
      setFeedbackMsg('Partial match. You mentioned some correct aspects, but make sure to emphasize reducing redundancy and maintaining consistency.');
    } else {
      setFeedbackMsg('Needs revision. Try to focus on table restructuring, eliminating duplication, and database integrity.');
    }
  };

  const handleNext = () => {
    // Navigate to results page
    navigate('/results', {
      state: {
        score: Math.round(similarityScore * 100),
        answer: userAnswer,
        feedback: feedbackMsg,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Practice Quiz"
        description="Write answers to practice questions. Our AI evaluates semantic similarity to provide immediate feedback."
        icon={Pencil}
      />

      <div className="bg-paper border border-card rounded-xl overflow-hidden mt-6">
        {/* Quiz Panel Header */}
        <div className="bg-sage-pale px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-text-base">{sampleQuiz.title}</div>
            <div className="text-[10px] text-text-muted mt-0.5">
              Question {sampleQuiz.currentQuestion} of {sampleQuiz.totalQuestions}
            </div>
          </div>
          <Badge variant="mcq">{sampleQuiz.type}</Badge>
        </div>

        {/* Quiz Panel Body */}
        <div className="p-4 md:p-6">
          {/* Progress bar */}
          <div className="h-1 bg-cream-dark rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-sage rounded-full transition-all duration-300"
              style={{ width: `${(sampleQuiz.currentQuestion / sampleQuiz.totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="flex items-start gap-2.5 mb-4">
            <HelpCircle size={16} className="text-sage mt-0.5 flex-shrink-0" />
            <h2 className="text-xs md:text-sm font-medium text-text-base leading-relaxed">
              {sampleQuiz.question}
            </h2>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={3}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Type your explanation here..."
              className="w-full p-3 bg-cream border border-cream-darker rounded-lg text-xs text-text-base placeholder:text-text-light focus:outline-none focus:border-sage disabled:bg-cream/40 disabled:text-text-muted transition-colors resize-none"
            />

            {/* Actions */}
            {!submitted ? (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserAnswer(sampleQuiz.sampleAnswer)}
                  className="bg-transparent border border-cream-darker text-text-muted text-[11px] px-3.5 py-1.5 rounded-lg cursor-pointer hover:bg-cream/50 transition-colors"
                >
                  Fill Auto-Demo Answer
                </button>
                <Button
                  type="submit"
                  disabled={!userAnswer.trim()}
                  className="px-4 py-1.5 text-xs font-medium"
                >
                  Submit Answer →
                </Button>
              </div>
            ) : null}
          </form>
        </div>

        {/* Answer results panel */}
        {submitted && (
          <div
            className={`border-t border-card p-4 transition-all duration-300 ${
              similarityScore >= 0.75
                ? 'bg-[#EAF3DE]'
                : similarityScore >= 0.50
                ? 'bg-amber-light/30'
                : 'bg-danger-light/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-white ${
                    similarityScore >= 0.75
                      ? 'bg-moss'
                      : similarityScore >= 0.50
                      ? 'bg-amber'
                      : 'bg-danger'
                  }`}
                >
                  {similarityScore >= 0.75 ? (
                    <Check size={11} />
                  ) : (
                    <AlertTriangle size={11} />
                  )}
                </div>
                <div
                  className={`text-xs font-semibold ${
                    similarityScore >= 0.75
                      ? 'text-moss'
                      : similarityScore >= 0.50
                      ? 'text-amber'
                      : 'text-danger'
                  }`}
                >
                  {similarityScore >= 0.75
                    ? 'Correct'
                    : similarityScore >= 0.50
                    ? 'Partial Correct'
                    : 'Needs Revision'}{' '}
                  — semantic match {similarityScore.toFixed(2)}
                </div>
              </div>

              {/* Progress/Bloom point update notification */}
              <div className="text-[10px] text-sage-dark font-medium">
                +15 XP for Sprout! 🌱
              </div>
            </div>

            <p
              className={`text-xs leading-relaxed ${
                similarityScore >= 0.75
                  ? 'text-moss'
                  : similarityScore >= 0.50
                  ? 'text-amber'
                  : 'text-danger'
              }`}
            >
              {feedbackMsg}
            </p>

            <div className="flex justify-end mt-4">
              <Button onClick={handleNext} className="text-xs py-1.5 flex items-center gap-1">
                Continue <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizMode;
