// ─── Main App component ───
// Configures React Router routes for all landing, auth, and dashboard sub-pages.

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Importing pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPDF from './pages/UploadPDF';
import MyMaterials from './pages/MyMaterials';
import StudyGuideline from './pages/StudyGuideline';
import QuestionBank from './pages/QuestionBank';
import StudyMode from './pages/StudyMode';
import QuizMode from './pages/QuizMode';
import Results from './pages/Results';
import Analytics from './pages/Analytics';
import PlantProgress from './pages/PlantProgress';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public / Unauthenticated routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes (wrapped in AppLayout) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload-pdf" element={<UploadPDF />} />
              <Route path="/my-materials" element={<MyMaterials />} />
              <Route path="/study-guideline" element={<StudyGuideline />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/study-mode" element={<StudyMode />} />
              <Route path="/quiz-mode" element={<QuizMode />} />
              <Route path="/results" element={<Results />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/plant-progress" element={<PlantProgress />} />
            </Route>
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
