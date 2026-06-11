// ─── Landing page ───
// Public-facing welcome page with hero section.

import { useNavigate } from 'react-router-dom';
import { Leaf, Upload, Brain, BarChart3, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Upload Lectures',
      description: 'Upload your lecture PDFs and we\'ll extract the key content automatically.',
    },
    {
      icon: Brain,
      title: 'AI Study Guides',
      description: 'Get AI-generated study guidelines tailored to your lecture material.',
    },
    {
      icon: Sparkles,
      title: 'Smart Questions',
      description: 'Auto-generated exam-style questions with semantic answer checking.',
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Identify weak topics and watch your knowledge plant grow.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-card bg-paper">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center text-base">
            🌱
          </div>
          <span className="font-caveat text-2xl font-semibold text-text-base">
            StudySprout <span className="text-sage">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button onClick={() => navigate('/register')}>
            Get started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="font-caveat text-5xl font-semibold text-text-base mb-4">
          Grow your knowledge,
          <br />
          <span className="text-sage">one lecture at a time</span>
        </h1>
        <p className="text-base text-text-muted max-w-lg mb-8">
          Upload your lecture PDFs and let AI create study guides, exam questions,
          and quizzes — while your digital plant grows with your progress.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/register')} className="px-6 py-3 text-base">
            <Leaf size={18} />
            Start studying
          </Button>
          <Button variant="secondary" onClick={() => navigate('/login')} className="px-6 py-3 text-base">
            I have an account
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-8 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-paper border border-card rounded-xl p-5 text-left hover:border-sage-light transition-colors"
            >
              <div className="w-10 h-10 bg-sage-pale rounded-lg flex items-center justify-center mb-3">
                <feature.icon size={20} className="text-sage-dark" />
              </div>
              <h3 className="text-sm font-medium text-text-base mb-1">{feature.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-text-light border-t border-card">
        StudySprout AI · Built with 🌱 for students
      </footer>
    </div>
  );
}

export default Landing;
