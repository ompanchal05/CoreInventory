import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import PasswordStrength, { validatePassword } from '../components/PasswordStrength';
import Starfield from '../components/Starfield';
import './Login.css';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}



function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Inventory Manager',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  function validate() {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) errs.password = passwordError;
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      await login(formData.email, formData.password, formData.role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="login-page">
      <Starfield />

      <div className={`login-card ${mounted ? 'login-card--in' : ''}`}>
        <div className="login-card-inner">
          <div className="login-header">
            <div className="login-logo-area">
              <Logo size="lg" />
            </div>
            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-subtitle">Manage your inventory operations securely</p>
          </div>

          {serverError && (
            <div className="alert alert-error" role="alert" style={{ marginBottom: 'var(--space-5)' }}>
              {serverError}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field" style={{ '--i': 0 }}>
              <label htmlFor="login-email" className="login-label">
                Email Address <span className="login-req">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                className={`login-input ${errors.email ? 'login-input--err' : ''}`}
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
              <span className="login-err-text">{errors.email || ''}</span>
            </div>

            <div className="login-field" style={{ '--i': 1 }}>
              <div className="login-label-row">
                <label htmlFor="login-password" className="login-label">
                  Password <span className="login-req">*</span>
                </label>
                <Link to="/forgot-password" className="login-forgot-link">Forgot password?</Link>
              </div>
              <div className="login-pw-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`login-input ${errors.password ? 'login-input--err' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <span className="login-err-text">{errors.password || ''}</span>
              <PasswordStrength password={formData.password} />
            </div>

            <div className="login-field" style={{ '--i': 2 }}>
              <label htmlFor="login-role" className="login-label">Sign in as</label>
              <select
                id="login-role"
                name="role"
                className="login-input login-select"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="Warehouse Staff">Warehouse Staff</option>
              </select>
            </div>

            <div className="login-field" style={{ '--i': 3 }}>
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                id="login-submit"
              >
                {loading && <span className="spinner" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="login-footer-link">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
