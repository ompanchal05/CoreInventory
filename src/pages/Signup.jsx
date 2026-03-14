import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import PasswordStrength, { validatePassword } from '../components/PasswordStrength';
import './Signup.css';

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

function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Inventory Manager',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function validate() {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errs.password = passwordError;
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms of service.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      await signup(formData.fullName, formData.email, formData.password, formData.role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Signup failed. Please try again.');
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <div className="logo-container">
            <Logo size="lg" />
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Get started with CoreInventory in minutes
          </p>
        </div>

        {serverError && (
          <div className="alert alert-error" role="alert">
            {serverError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="signup-name"
              type="text"
              name="fullName"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              disabled={loading}
            />
            <span className="form-error">{errors.fullName || ''}</span>
          </div>

          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="signup-email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
            />
            <span className="form-error">{errors.email || ''}</span>
          </div>

          <div className="signup-row">
            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <span className="form-error">{errors.password || ''}</span>
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm" className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="signup-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <span className="form-error">{errors.confirmPassword || ''}</span>
            </div>
          </div>

          <PasswordStrength password={formData.password} />

          <div className="form-group">
            <label htmlFor="signup-role" className="form-label">
              Role
            </label>
            <select
              id="signup-role"
              name="role"
              className="form-input form-select"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              id="signup-terms"
              type="checkbox"
              name="agreeTerms"
              className="checkbox-input"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="signup-terms" className="checkbox-label">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.agreeTerms && (
            <span className="form-error">{errors.agreeTerms}</span>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            id="signup-submit"
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
