import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import PasswordStrength, { validatePassword } from '../components/PasswordStrength';
import './ForgotPassword.css';

const STEPS = {
  EMAIL: 0,
  OTP: 1,
  NEW_PASSWORD: 2,
};

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

function ForgotPassword() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, resetPassword, loading } = useAuth();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef([]);

  function getStepTitle() {
    switch (step) {
      case STEPS.EMAIL:
        return 'Reset your password';
      case STEPS.OTP:
        return 'Enter verification code';
      case STEPS.NEW_PASSWORD:
        return 'Set new password';
      default:
        return '';
    }
  }

  function getStepDescription() {
    switch (step) {
      case STEPS.EMAIL:
        return 'Enter the email address associated with your account and we will send you a verification code.';
      case STEPS.OTP:
        return `We've sent a 6-digit code to ${email}. Enter it below to verify your identity.`;
      case STEPS.NEW_PASSWORD:
        return 'Choose a strong new password for your account.';
      default:
        return '';
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await sendOtp(email);
      setStep(STEPS.OTP);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleOtpChange(index, value) {
    if (value && !/^\d$/.test(value)) return;

    setError('');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const focusIdx = Math.min(pasted.length, 5);
      otpRefs.current[focusIdx]?.focus();
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    try {
      await verifyOtp(email, code);
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword(email, newPassword);
      setSuccess('Your password has been reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  function renderStepProgress() {
    return (
      <div className="step-progress" aria-label="Progress">
        <div className={`step-dot ${step >= STEPS.EMAIL ? 'active' : ''} ${step > STEPS.EMAIL ? 'completed' : ''}`} />
        <div className={`step-line ${step > STEPS.EMAIL ? 'completed' : ''}`} />
        <div className={`step-dot ${step >= STEPS.OTP ? 'active' : ''} ${step > STEPS.OTP ? 'completed' : ''}`} />
        <div className={`step-line ${step > STEPS.OTP ? 'completed' : ''}`} />
        <div className={`step-dot ${step >= STEPS.NEW_PASSWORD ? 'active' : ''}`} />
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <Logo size="lg" />
          </div>

          {renderStepProgress()}

          <h1 className="auth-title">{getStepTitle()}</h1>
          <p className="auth-subtitle">{getStepDescription()}</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 'var(--space-5)' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="status" style={{ marginBottom: 'var(--space-5)' }}>
            {success}
          </div>
        )}

        {/* Step 1: Email */}
        {step === STEPS.EMAIL && (
          <form className="auth-form" onSubmit={handleEmailSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="reset-email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="reset-email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              id="reset-send-otp"
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Sending code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === STEPS.OTP && (
          <form className="auth-form" onSubmit={handleOtpSubmit} noValidate>
            <div className="otp-container" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={loading}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              id="reset-verify-otp"
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => { setOtp(['','','','','','']); setStep(STEPS.EMAIL); setError(''); }}
                disabled={loading}
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === STEPS.NEW_PASSWORD && !success && (
          <form className="auth-form" onSubmit={handlePasswordSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="new-password" className="form-label">
                New Password <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new-password" className="form-label">
                Confirm New Password <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
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
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              id="reset-password-submit"
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
