import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  if (isAuthenticated && user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const currentUser = await login(formData.email, formData.password);

      if (currentUser.role !== 'admin') {
        throw new Error('This account does not have admin access.');
      }

      navigate('/admin', { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || loginError.message || 'Admin login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-section auth-page">
      <div className="auth-card">
        <p className="eyebrow">Admin access</p>
        <h1>Admin Login</h1>
        <p>Use the secure administrator account to manage the store.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login as admin'}
          </button>
        </form>
        <p className="auth-switch">
          Back to <Link to="/login">customer login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
