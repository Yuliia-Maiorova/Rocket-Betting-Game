import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await resetPassword(email);
    
    if (result.success) {
      setMessage('Check your email for password reset instructions');
    } else {
      setError(result.error || 'Failed to send reset email');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">🔑 Reset Password</h1>
        <p className="auth-subtitle">Enter your email to receive reset instructions</p>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {message && (
          <div className="alert success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" className="form-link">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
