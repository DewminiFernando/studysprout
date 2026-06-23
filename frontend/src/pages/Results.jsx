// ─── Results page ───
// Summarizes quiz performance, semantic answer checking, and detailed feedback per question.

import { useLocation, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, RefreshCw, BookOpen, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve quizResult from navigation state
  const quizResult = location.state?.quizResult;

  // Fallback if no result is found in navigation state
  if (!quizResult) {
    return (
      <div className="max-w-md mx-auto text-center mt-6">
        <div className="bg-paper border border-card rounded-xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-sage-pale text-sage-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={28} />
          </div>
          <h1 className="text-sm md:text-base font-semibold text-text-base">No Quiz Results Found</h1>
          <p className="text-xs text-text-muted mt-2 max-w-xs mx-auto">
            It looks like you navigated here directly. Please start a quiz from your materials list.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/my-materials')} className="w-full justify-center text-xs">
              Go to My Materials
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    score,
    total_questions,
    earned_points,
    correct_count,
    partial_count,
    needs_revision_count,
    results = [],
    weak_topics = [],
    material_id,
  } = quizResult;

  // Determine feedback message based on score
  let overviewMessage = "Keep practice going! Every step counts towards mastery.";
  if (score >= 85) {
    overviewMessage = "Outstanding performance! Your explanations capture the concepts perfectly. 🌟";
  } else if (score >= 60) {
    overviewMessage = "Great effort! You've got a solid understanding, with just a few areas to refine. 🌱";
  } else if (score >= 40) {
    overviewMessage = "A good start. Revising weak topics will help strengthen your descriptions. 💧";
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 space-y-6">
      <PageHeader
        title="Quiz Evaluation"
        description="Review detailed semantic grading, similarity scores, and topic weaknesses for this attempt."
        icon={Award}
      />

      {/* Overview Card */}
      <div className="bg-paper border border-card rounded-xl p-6 shadow-sm text-center">
        <h2 className="text-base font-semibold text-text-base">Quiz Completed!</h2>
        
        {/* Score Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="bg-cream border border-cream-darker rounded-xl p-4">
            <div className="text-2xl font-bold text-text-base">{score}%</div>
            <div className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wider font-semibold">
              Final Score
            </div>
          </div>
          <div className="bg-cream border border-cream-darker rounded-xl p-4">
            <div className="text-2xl font-bold text-text-base">
              {earned_points.toFixed(1)} / {total_questions}
            </div>
            <div className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wider font-semibold">
              Points Earned
            </div>
          </div>
          <div className="bg-cream border border-cream-darker rounded-xl p-4">
            <div className="text-xs font-semibold text-text-base flex flex-col justify-center h-full space-y-0.5">
              <div className="text-moss">Correct: {correct_count}</div>
              <div className="text-amber">Partial: {partial_count}</div>
              <div className="text-danger">Revision: {needs_revision_count}</div>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-text-muted italic max-w-md mx-auto mb-5">
          {overviewMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <Button
            onClick={() => navigate('/dashboard')}
            className="flex-1 justify-center py-2 text-xs"
          >
            Go to Dashboard <ArrowRight size={14} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/quiz-mode', { state: { materialId: material_id } })}
            className="flex-1 justify-center py-2 text-xs"
          >
            <RefreshCw size={13} className="mr-1" /> Retake Quiz
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/my-materials')}
            className="flex-1 justify-center py-2 text-xs"
          >
            <BookOpen size={13} className="mr-1" /> Materials
          </Button>
        </div>
      </div>

      {/* Weak Topics Analysis (if any) */}
      {weak_topics.length > 0 && (
        <div className="bg-paper border border-card rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-text-base mb-2">Detected Weak Topics</h3>
          <p className="text-[11px] text-text-muted mb-3">
            The AI detected the following areas needing further revision based on your quiz responses:
          </p>
          <div className="flex flex-wrap gap-2">
            {weak_topics.map((wt, i) => (
              <span
                key={i}
                className="text-[11px] px-3 py-1 rounded-full bg-amber-light text-amber font-medium border border-amber/10"
              >
                {wt.topic} (Weakness: {(wt.weakness_rate * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question Results List */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-text-base uppercase tracking-wider">
          Detailed Question Breakdown
        </h3>

        {results.map((res, index) => {
          // Status configurations
          let statusBadgeClass = "";
          let statusIcon = null;
          let statusColorClass = "";
          
          if (res.result === "Correct") {
            statusBadgeClass = "bg-[#EAF3DE] text-moss border-moss/10";
            statusColorClass = "text-moss";
            statusIcon = <CheckCircle size={14} className="text-moss" />;
          } else if (res.result === "Partially Correct") {
            statusBadgeClass = "bg-amber-light text-amber border-amber/10";
            statusColorClass = "text-amber";
            statusIcon = <AlertTriangle size={14} className="text-amber" />;
          } else {
            statusBadgeClass = "bg-danger-light text-danger border-danger/10";
            statusColorClass = "text-danger";
            statusIcon = <XCircle size={14} className="text-danger" />;
          }

          return (
            <div
              key={res.question_id}
              className="bg-paper border border-card rounded-xl overflow-hidden shadow-sm"
            >
              {/* Question Header */}
              <div className="bg-sage-pale px-4 py-3 flex items-center justify-between border-b border-card">
                <span className="text-[11px] font-bold text-text-base">
                  Question {index + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  {res.topic && (
                    <span className="text-[9px] px-2 py-0.5 bg-cream-dark text-text-muted rounded-full font-medium">
                      {res.topic}
                    </span>
                  )}
                  {res.difficulty && (
                    <span className="text-[9px] px-2 py-0.5 bg-cream-dark text-text-muted rounded-full font-medium uppercase">
                      {res.difficulty}
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${statusBadgeClass}`}>
                    {statusIcon}
                    {res.result} ({(res.points * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              {/* Question Body */}
              <div className="p-4 md:p-5 space-y-3.5 text-left">
                {/* Question Text */}
                <div className="text-xs md:text-sm font-medium text-text-base leading-relaxed">
                  {res.question_text}
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Student Answer */}
                  <div>
                    <div className="text-[10px] font-bold text-text-muted mb-1 uppercase tracking-wider">
                      Your Answer
                    </div>
                    <div className="p-3 bg-cream/40 border border-cream-darker/60 rounded-lg text-xs text-text-base whitespace-pre-wrap min-h-[60px] leading-relaxed">
                      {res.student_answer ? `"${res.student_answer}"` : <span className="text-text-light italic">No answer provided.</span>}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <div className="text-[10px] font-bold text-text-muted mb-1 uppercase tracking-wider">
                      Reference Answer
                    </div>
                    <div className="p-3 bg-sage-pale/20 border border-sage-light/20 rounded-lg text-xs text-text-base whitespace-pre-wrap min-h-[60px] leading-relaxed">
                      "{res.correct_answer}"
                    </div>
                  </div>
                </div>

                {/* Similarity Metrics & Explanation */}
                <div className="border-t border-cream-dark pt-3 mt-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-text-muted uppercase">Semantic Match:</span>
                    <span className={`font-bold ${statusColorClass}`}>{res.similarity_score.toFixed(4)}</span>
                    <span className="text-cream-darker">•</span>
                    <span className="font-bold text-text-muted uppercase">Points:</span>
                    <span className={`font-bold ${statusColorClass}`}>{res.points.toFixed(1)}</span>
                  </div>

                  {res.explanation && (
                    <div className="bg-[#EAF3DE]/10 p-3 rounded-lg border border-sage-pale text-xs text-text-muted leading-relaxed">
                      <span className="font-bold text-sage-dark block mb-0.5">Explanation</span>
                      {res.explanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Results;
