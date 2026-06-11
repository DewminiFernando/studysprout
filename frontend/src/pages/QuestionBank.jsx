// ─── QuestionBank page ───
// Lists generated questions with options, difficulty badges and solutions.

import { useState } from 'react';
import { ListChecks, Search, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const mockQuestions = [
  {
    id: 1,
    question: 'What is database normalization and why is it important in relational database design?',
    difficulty: 'medium',
    type: 'Short answer',
    material: 'Database Management Systems',
    solution: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves creating tables and establishing relationships between those tables according to rules designed to protect the data and to make the database more flexible by eliminating redundancy and inconsistent dependency.',
  },
  {
    id: 2,
    question: 'What is the purpose of SQL views?',
    difficulty: 'easy',
    type: 'Short answer',
    material: 'Database Management Systems',
    solution: 'A SQL view is a virtual table based on the result-set of an SQL statement. It contains rows and columns just like a real table. Views are used to simplify complex database schemas, focus on specific data, and secure database access by restricting direct table writes.',
  },
  {
    id: 3,
    question: 'Explain the difference between a stack and a queue.',
    difficulty: 'easy',
    type: 'MCQ',
    material: 'Data Structures & Algorithms',
    solution: 'A stack is a Last-In-First-Out (LIFO) data structure where elements are inserted and deleted from the same end (top). A queue is a First-In-First-Out (FIFO) data structure where elements are inserted at the back and deleted from the front.',
  },
  {
    id: 4,
    question: 'Describe the main conditions required for a deadlock to occur in an operating system.',
    difficulty: 'hard',
    type: 'Short answer',
    material: 'Operating Systems Concepts',
    solution: 'For a deadlock to occur, four Coffman conditions must hold simultaneously: 1. Mutual Exclusion (non-shareable resources), 2. Hold and Wait (processes holding resources while waiting for others), 3. No Preemption (resources cannot be forcibly taken), 4. Circular Wait (a closed chain of processes waiting for each other).',
  },
];

function QuestionBank() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredQuestions = mockQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Question Bank"
        description="Browse all AI-generated test questions. Expand any question to view the suggested answer and criteria."
        icon={ListChecks}
      />

      {/* Filter and Search Bar */}
      <div className="bg-paper border border-card rounded-xl p-4 mt-6 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or materials..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-cream-darker rounded-lg text-xs text-text-base placeholder:text-text-light focus:outline-none focus:border-sage transition-colors"
          />
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors cursor-pointer border ${
                selectedDifficulty === diff
                  ? 'bg-sage-pale border-sage-light text-sage-dark font-medium'
                  : 'bg-transparent border-cream-darker text-text-muted hover:bg-cream/50'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-3 mt-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
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
                      <p className="text-xs font-medium text-text-base leading-relaxed">{q.question}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] text-text-light">{q.material}</span>
                        <span className="text-[10px] text-cream-darker">•</span>
                        <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                        <Badge variant="info">{q.type}</Badge>
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
                      Suggested Solution
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {q.solution}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-paper border border-card rounded-xl p-8 text-center text-xs text-text-light">
            No questions match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionBank;
