import { useMemo } from 'react';
import './PasswordStrength.css';

const RULES = [
  { id: 'length',    label: 'Min. 8 characters',    test: (p) => p.length >= 8 },
  { id: 'uppercase', label: '1 uppercase letter',    test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: '1 lowercase letter',    test: (p) => /[a-z]/.test(p) },
  { id: 'digit',     label: '1 numeric digit',       test: (p) => /\d/.test(p) },
  { id: 'special',   label: '1 special character',   test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 5.5L4 7.5L8 3"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PasswordStrength({ password = '' }) {
  const results = useMemo(() => {
    return RULES.map((rule) => ({
      ...rule,
      met: password.length > 0 && rule.test(password),
    }));
  }, [password]);

  const metCount = results.filter((r) => r.met).length;

  if (!password) return null;

  return (
    <div className="password-strength" id="password-strength-indicator">
      <div className="strength-header">
        <span className="strength-title">Password strength</span>
        <span className={`strength-label strength-${metCount}`}>
          {STRENGTH_LABELS[metCount]}
        </span>
      </div>

      <div className="strength-bar-track">
        <div className={`strength-bar-fill strength-${metCount}`} />
      </div>

      <div className="strength-rules">
        {results.map((rule) => (
          <div
            key={rule.id}
            className={`strength-rule ${rule.met ? 'met' : ''}`}
          >
            <span className="strength-rule-icon">
              <CheckIcon />
            </span>
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Validates password against all rules. Returns error string or empty string. */
export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least 1 lowercase letter.';
  if (!/\d/.test(password)) return 'Password must contain at least 1 digit.';
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) return 'Password must contain at least 1 special character.';
  return '';
}

export default PasswordStrength;
