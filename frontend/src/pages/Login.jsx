// ─── Login page ───
// Simple login form with email + password.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌱</div>
          <h1 className="font-caveat text-3xl font-semibold text-text-base">
            StudySprout <span className="text-sage">AI</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">Welcome back! Log in to continue studying.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-paper border border-card rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2.5 bg-cream border border-cream-darker rounded-lg text-sm text-text-base placeholder:text-text-light focus:outline-none focus:border-sage transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-cream border border-cream-darker rounded-lg text-sm text-text-base placeholder:text-text-light focus:outline-none focus:border-sage transition-colors"
            />
          </div>
          <Button type="submit" className="w-full justify-center">
            Log in
          </Button>
        </form>

        {/* Register link */}
        <p className="text-center text-xs text-text-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-sage-dark font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
