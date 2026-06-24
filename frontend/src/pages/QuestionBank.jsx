// ─── QuestionBank page ───
// Lists AI-generated questions with filters, difficulty badges, and solutions.
// Fetches real data from the backend API.

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListChecks, Search, HelpCircle, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { materialAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const QUESTION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'mcq', label: 'MCQ' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'explain-type', label: 'Explain Type' },
  { value: 'true/false', label: 'True / False' },
  { value: 'identify-type', label: 'Identify Type' },
  { value: 'scenario-based', label: 'Scenario Based' },
];

function QuestionBank() {
  const { fetchPlantProgress } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Filter state
  const [topicFilter, setTopicFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const toggleExpand = (qId) => {
    setExpandedId(expandedId === qId ? null : qId);
  };

  // Fetch existing questions
  const fetchQuestions = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const response = await materialAPI.getQuestions(id, filters);
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

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  // Generate questions
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await materialAPI.generateQuestions(id);
      setQuestions(response.data);
      setTopicFilter('');
      setTypeFilter('');
      fetchPlantProgress();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate questions. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    const filters = {};
    if (topicFilter.trim()) filters.topic = topicFilter.trim();
    if (typeFilter) filters.type = typeFilter;
    fetchQuestions(filters);
  };

  // Clear filters
  const handleClearFilters = () => {
    setTopicFilter('');
    setTypeFilter('');
    fetchQuestions();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate(`/materials/${id}`)}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sage-dark mb-4 bg-transparent border-none cursor-pointer"
      >
        <ChevronUp size={14} className="rotate-[-90deg]" /> Back to Material
      </button>

      <div className="flex items-center justify-between">
        <PageHeader
          title="Question Bank"
          description="Browse all AI-generated test questions. Expand any question to view the suggested answer."
          icon={ListChecks}
        />
        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="text-xs py-2 flex-shrink-0"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Generating...
            </span>
          ) : questions.length > 0 ? (
            '↻ Regenerate Questions'
          ) : (
            'Generate Questions'
          )}
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-paper border border-card rounded-xl p-4 mt-4 flex flex-col sm:flex-row gap-3">
        {/* Topic search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            placeholder="Filter by topic..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-cream-darker rounded-lg text-xs text-text-base placeholder:text-text-light focus:outline-none focus:border-sage transition-colors"
          />
        </div>

        {/* Question type dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-cream border border-cream-darker rounded-lg text-xs text-text-base focus:outline-none focus:border-sage transition-colors cursor-pointer"
        >
          {QUESTION_TYPES.map((qt) => (
            <option key={qt.value} value={qt.value}>{qt.label}</option>
          ))}
        </select>

        {/* Apply & Clear */}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleApplyFilters} className="text-xs py-1.5 px-3">
            Apply
          </Button>
          <Button variant="ghost" onClick={handleClearFilters} className="text-xs py-1.5 px-3">
            Clear
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 mt-4">
          <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-text-muted">Loading questions...</p>
        </div>
      ) : error ? (
        <div className="bg-paper border border-card rounded-xl p-8 text-center flex flex-col items-center justify-center mt-4">
          <div className="w-12 h-12 bg-danger-light/30 text-danger rounded-full flex items-center justify-center mb-3">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-semibold text-text-base">Error</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">{error}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-paper border border-card rounded-xl p-10 text-center flex flex-col items-center justify-center mt-4">
          <div className="w-12 h-12 bg-sage-pale text-sage rounded-full flex items-center justify-center mb-3">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-sm font-medium text-text-base">No Questions Yet</h3>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Click "Generate Questions" to create AI-powered exam-style questions from your uploaded PDF.
          </p>
        </div>
      ) : (
        <>
          {/* Question count */}
          <div className="text-[11px] text-text-light mt-4 mb-2">
            Showing {questions.length} question{questions.length !== 1 ? 's' : ''}
          </div>

          {/* Question list */}
          <div className="space-y-3">
            {questions.map((q) => {
              const isExpanded = expandedId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-paper border border-card rounded-xl overflow-hidden hover:border-sage-light transition-all"
                >
                  {/* Header section (Clickable to expand) */}
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-7 h-7 bg-sage-pale text-sage-dark rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HelpCircle size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-base leading-relaxed">{q.question_text}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {q.topic && (
                            <>
                              <span className="text-[10px] text-text-light">{q.topic}</span>
                              <span className="text-[10px] text-cream-darker">•</span>
                            </>
                          )}
                          <Badge variant={q.difficulty || 'default'}>{q.difficulty || 'N/A'}</Badge>
                          <Badge variant="info">{q.question_type}</Badge>
                        </div>
                      </div>
                    </div>
                    <button className="text-text-muted p-1 hover:text-text-base bg-transparent border-none">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expanded Answer Section */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-cream-dark bg-cream/20">
                      <div className="text-[11px] font-semibold text-sage-dark mb-1.5">
                        Correct Answer
                      </div>
                      <p className="text-xs text-text-base leading-relaxed mb-3 font-medium">
                        {q.correct_answer}
                      </p>
                      {q.explanation && (
                        <>
                          <div className="text-[11px] font-semibold text-sage-dark mb-1.5">
                            Explanation
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">
                            {q.explanation}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer nav */}
          <div className="flex justify-between items-center bg-cream-dark/50 border border-card rounded-xl p-4 mt-6">
            <div>
              <h4 className="text-xs font-semibold text-text-base">Ready to study?</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Review questions one at a time in Study Mode.</p>
            </div>
            <Button onClick={() => navigate(`/study-mode/${id}`)}>
              Enter Study Mode
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionBank;
