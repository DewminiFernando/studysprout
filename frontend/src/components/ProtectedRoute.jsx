// ─── Protected Route Component ───
// Guards authenticated pages. If the app is checking credentials, a themed loader is shown.
// If unauthorized, redirects to /login.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-3">
        <div className="text-4xl animate-bounce">🌱</div>
        <div className="text-sm text-sage-dark font-medium animate-pulse font-caveat text-xl">
          Sprouting your dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
