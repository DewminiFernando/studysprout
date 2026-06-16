// ─── Login page ───
// Simple login form with email + password.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
          {error && (
            <div className="bg-danger-light text-danger border border-card text-xs rounded-lg p-3 font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-text-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2.5 bg-cream border border-cream-darker rounded-lg text-sm text-text-base placeholder:text-text-light focus:outline-none focus:border-sage transition-colors"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
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
