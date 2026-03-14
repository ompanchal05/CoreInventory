import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const STORAGE_KEY = 'coreinventory_user';

function getStoredUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  async function login(email, password, role) {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // Save token to localStorage (optional, but good practice if you expand later to protected routes forcing fetch)
      localStorage.setItem('core_token', data.token);

      const newUser = {
        ...data.user,
        loginTime: new Date().toISOString(),
      };

      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }

  async function signup(name, email, password, role) {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      localStorage.setItem('core_token', data.token);

      const newUser = {
        ...data.user,
        loginTime: new Date().toISOString(),
      };

      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp(email) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    if (!email) {
      throw new Error('Please enter your email address.');
    }
    // In production, this would send an actual OTP
    return true;
  }

  async function verifyOtp(email, otp) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    if (!otp || otp.length !== 6) {
      throw new Error('Please enter a valid 6-digit code.');
    }
    // Accept any 6-digit code for demo
    return true;
  }

  async function resetPassword(email, newPassword) {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }
    return true;
  }

  function logout() {
    localStorage.removeItem('core_token');
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    sendOtp,
    verifyOtp,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
