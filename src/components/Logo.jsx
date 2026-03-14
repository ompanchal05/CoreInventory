import './Logo.css';

function Logo({ size = 'md' }) {
  const sizes = {
    sm: { icon: 28, text: '1rem' },
    md: { icon: 36, text: '1.25rem' },
    lg: { icon: 44, text: '1.5rem' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`logo logo--${size}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="logo-icon"
      >
        <rect width="44" height="44" rx="10" fill="#0a1210" stroke="#162820" strokeWidth="1" />
        {/* Top face */}
        <path
          d="M22 12 L32 17.5 L22 23 L12 17.5 Z"
          fill="rgba(16, 185, 129, 0.15)"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Left face */}
        <path
          d="M12 17.5 L22 23 L22 33 L12 27.5 Z"
          fill="rgba(16, 185, 129, 0.08)"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Right face */}
        <path
          d="M32 17.5 L22 23 L22 33 L32 27.5 Z"
          fill="rgba(16, 185, 129, 0.04)"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="12" r="1.8" fill="#10b981" opacity="0.8" />
      </svg>
      <span className="logo-text" style={{ fontSize: s.text }}>
        <span className="logo-text-core">Core</span>
        <span className="logo-text-inventory">Inventory</span>
      </span>
    </div>
  );
}

export default Logo;
