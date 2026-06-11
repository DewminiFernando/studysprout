// ─── Demo data for StudySprout AI ───
// This file contains all dummy data used across the app.
// Replace with real API calls once the backend is ready.

export const currentUser = {
  name: 'Devi',
  initials: 'D',
  email: 'devi@example.com',
  streak: 5,
  plantLevel: 3,
  plantName: 'Sprout',
  plantEmoji: '🌿',
  plantXP: 62,
  plantMaxXP: 100,
};

export const dashboardStats = [
  {
    id: 'pdfs',
    label: 'PDFs uploaded',
    value: 4,
    icon: 'FileText',
    iconBg: 'bg-sage-pale',
    iconColor: 'text-sage-dark',
  },
  {
    id: 'questions',
    label: 'Questions generated',
    value: 86,
    icon: 'HelpCircle',
    iconBg: 'bg-cream-dark',
    iconColor: 'text-amber',
  },
  {
    id: 'score',
    label: 'Avg quiz score',
    value: '74%',
    icon: 'CheckCircle',
    iconBg: 'bg-[#EAF3DE]',
    iconColor: 'text-moss',
  },
  {
    id: 'weak',
    label: 'Weak topics',
    value: 3,
    icon: 'AlertCircle',
    iconBg: 'bg-amber-light',
    iconColor: 'text-amber',
  },
];

export const recentMaterials = [
  {
    id: 1,
    name: 'Database Management Systems',
    questions: 24,
    week: 'Week 4',
    progress: 80,
    lastScore: '82%',
    status: 'Quiz done',
    statusType: 'done', // 'done' | 'revision'
  },
  {
    id: 2,
    name: 'Data Structures & Algorithms',
    questions: 18,
    week: 'Week 3',
    progress: 44,
    lastScore: '55%',
    status: 'Needs revision',
    statusType: 'revision',
  },
  {
    id: 3,
    name: 'Operating Systems Concepts',
    questions: 30,
    week: 'Week 5',
    progress: 65,
    lastScore: '70%',
    status: 'In progress',
    statusType: 'done',
  },
  {
    id: 4,
    name: 'Computer Networks Basics',
    questions: 12,
    week: 'Week 2',
    progress: 20,
    lastScore: '45%',
    status: 'Needs revision',
    statusType: 'revision',
  },
];

export const weakTopics = [
  { id: 1, name: 'SQL Views', type: 'weak' },
  { id: 2, name: 'Normalization', type: 'weak' },
  { id: 3, name: 'Recursion', type: 'weak' },
  { id: 4, name: 'Binary Trees', type: 'ok' },
  { id: 5, name: 'HTTP Basics', type: 'ok' },
];

export const plantHistory = [
  { day: 'Mon', height: 40 },
  { day: 'Tue', height: 55 },
  { day: 'Wed', height: 45 },
  { day: 'Thu', height: 70 },
  { day: 'Fri', height: 62 },
  { day: 'Sat', height: 80 },
  { day: 'Sun', height: 62 },
];

export const plantActions = [
  { id: 1, label: 'PDF uploaded', icon: 'Upload', done: true },
  { id: 2, label: 'Questions gen', icon: 'Sparkles', done: true },
  { id: 3, label: 'Complete quiz', icon: 'Pencil', done: false },
  { id: 4, label: 'Score above 70%', icon: 'BarChart3', done: false },
];

export const sampleQuiz = {
  title: 'Quiz — DBMS Week 4',
  currentQuestion: 3,
  totalQuestions: 10,
  type: 'Short answer',
  question: 'What is database normalization and why is it important in relational database design?',
  sampleAnswer: 'It removes duplicate data and organises tables so the database stays consistent and avoids errors...',
};

export const sampleStudyGuide = {
  title: 'DBMS Week 4 — Study Guide',
  sections: [
    {
      heading: 'Database Normalization',
      points: [
        'Normalization reduces redundancy and dependency in database tables.',
        'First Normal Form (1NF): Eliminate repeating groups.',
        'Second Normal Form (2NF): Remove partial dependencies.',
        'Third Normal Form (3NF): Remove transitive dependencies.',
      ],
    },
    {
      heading: 'SQL Views',
      points: [
        'A view is a virtual table based on the result of an SQL query.',
        'Views simplify complex queries and provide data security.',
        'Views can be updatable or read-only.',
      ],
    },
  ],
};

export const analyticsData = {
  weeklyScores: [
    { week: 'Wk 1', score: 60 },
    { week: 'Wk 2', score: 45 },
    { week: 'Wk 3', score: 55 },
    { week: 'Wk 4', score: 82 },
    { week: 'Wk 5', score: 70 },
  ],
  topicBreakdown: [
    { topic: 'DBMS', correct: 20, total: 24 },
    { topic: 'DSA', correct: 10, total: 18 },
    { topic: 'OS', correct: 19, total: 30 },
    { topic: 'Networks', correct: 5, total: 12 },
  ],
};

export const dashboardTabs = ['Overview', 'Weak topics', 'History'];

export const sidebarNavItems = {
  main: [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    { label: 'Upload PDF', icon: 'Upload', path: '/upload' },
    { label: 'My Materials', icon: 'BookOpen', path: '/materials' },
  ],
  study: [
    { label: 'Question Bank', icon: 'ListChecks', path: '/questions' },
    { label: 'Quiz Mode', icon: 'Pencil', path: '/quiz' },
    { label: 'Study Mode', icon: 'Eye', path: '/study' },
  ],
  progress: [
    { label: 'Analytics', icon: 'BarChart3', path: '/analytics' },
    { label: 'My Plant', icon: 'Leaf', path: '/plant' },
  ],
};
