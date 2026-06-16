// ─── Register page ───
// Simple sign-up form.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Registration failed. Please check your details and try again.'
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
          <p className="text-xs text-text-muted mt-1">Create an account and start growing your knowledge.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-paper border border-card rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-danger-light text-danger border border-card text-xs rounded-lg p-3 font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-text-muted mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Devi Fernando"
              className="w-full px-3 py-2.5 bg-cream border border-cream-darker rounded-lg text-sm text-text-base placeholder:text-text-light focus:outline-none focus:border-sage transition-colors"
              disabled={isSubmitting}
            />
          </div>
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
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-xs text-text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-dark font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
