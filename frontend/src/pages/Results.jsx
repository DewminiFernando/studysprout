// ─── Results page ───
// Summarizes quiz performance and plant XP rewards.

import { useLocation, useNavigate } from 'react-router-dom';
import { Award, Leaf, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pick up simulated results from react-router state if available
  const result = location.state || {
    score: 86,
    answer: 'It removes duplicate data and organises tables so the database stays consistent and avoids errors...',
    feedback: 'Normalization organizes data to reduce redundancy and improve integrity. Your answer captures the core meaning well.',
  };

  return (
    <div className="max-w-md mx-auto text-center mt-6">
      <div className="bg-paper border border-card rounded-xl p-6 shadow-sm">
        {/* Award Badge Icon */}
        <div className="w-14 h-14 bg-sage-pale text-sage-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <Award size={28} />
        </div>

        <h1 className="text-xl font-medium text-text-base">Quiz Completed!</h1>
        <p className="text-xs text-text-muted mt-1">
          DBMS Practice Quiz — Question 3 evaluation
        </p>

        {/* Score Display */}
        <div className="bg-cream border border-cream-darker rounded-xl p-4 my-5">
          <div className="text-3xl font-semibold text-text-base">{result.score}%</div>
          <div className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider font-medium">
            Semantic Match Score
          </div>
        </div>

        {/* Plant Grow Upgrade message */}
        <div className="bg-[#EAF3DE] border border-card rounded-xl p-3.5 flex items-center gap-3 text-left mb-6">
          <div className="text-2xl flex-shrink-0">🌿</div>
          <div>
            <div className="text-xs font-semibold text-moss">Your Sprout is growing!</div>
            <div className="text-[10px] text-text-muted mt-0.5">
              You earned +15 XP. Only 23 XP left until your plant blooms.
            </div>
          </div>
        </div>

        {/* Answer Recap */}
        <div className="text-left mb-6">
          <div className="text-[10px] font-semibold text-text-light uppercase tracking-wider mb-2">
            Your Answer
          </div>
          <div className="bg-cream/50 p-3 rounded-lg border border-cream-darker/60 text-xs text-text-muted leading-relaxed">
            "{result.answer}"
          </div>
          <div className="text-[10px] font-semibold text-text-light uppercase tracking-wider mt-4 mb-2">
            AI Feedback
          </div>
          <div className="bg-[#EAF3DE]/30 p-3 rounded-lg border border-card text-xs text-moss leading-relaxed">
            {result.feedback}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={() => navigate('/dashboard')} className="w-full justify-center">
            Go to Dashboard <ArrowRight size={14} />
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/quiz-mode')}
              className="text-xs py-2 justify-center"
            >
              <RefreshCw size={13} /> Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/my-materials')}
              className="text-xs py-2 justify-center"
            >
              <BookOpen size={13} /> Materials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
