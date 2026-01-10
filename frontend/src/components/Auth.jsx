import React, { useState } from 'react';

const Icons = {
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
};

const Auth = ({ isLogin, setIsLogin, authData, setAuthData, handleAuth, authError }) => {
  const [mode, setMode] = useState(isLogin ? 'login' : 'signup');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const API_BASE = '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (mode === 'signup' && !authData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!authData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(authData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!authData.password) {
      newErrors.password = 'Password is required';
    } else if (authData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await handleAuth(e);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAuthData({ ...authData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsLogin(newMode === 'login');
    setErrors({});
    // Clear all inputs when switching modes
    setAuthData({ email: '', password: '', name: '' });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-mesh-gradient"></div>
      <div className="auth-content">
        <div className="auth-brand-horizontal">
          <div className="brand-logo-large">
            <img src="/logo.svg" alt="TaskLogger Logo" width="32" height="32" />
          </div>
          <div className="brand-text">
            <h1>TaskLogger</h1>
            <p>Master your workflow with precision.</p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-tabs-modern">
              <button
                className={mode === 'login' ? 'active' : ''}
                onClick={() => switchMode('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => switchMode('signup')}
                type="button"
              >
                Sign Up
              </button>
              <div className={`tab-indicator ${mode === 'login' ? 'left' : 'right'}`}></div>
            </div>
          </div>

          <div className="auth-card-body">
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {mode === 'signup' && (
                <div className={`input-group-modern ${errors.name ? 'has-error' : ''}`}>
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <span className="icon"><Icons.User /></span>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={authData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
              )}

              <div className={`input-group-modern ${errors.email ? 'has-error' : ''}`}>
                <label>Email Address</label>
                <div className="input-with-icon">
                  <span className="icon"><Icons.Mail /></span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={authData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`input-group-modern ${errors.password ? 'has-error' : ''}`}>
                <div className="label-row">
                  <label>Password</label>
                </div>
                <div className="input-with-icon">
                  <span className="icon"><Icons.Lock /></span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {(authError || errors.server) && (
                <div className="auth-error-banner">
                  <span className="error-icon"><Icons.AlertCircle /></span>
                  {authError || errors.server}
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="btn-loader"></div>
                ) : (
                  <>
                    <span>
                      {mode === 'login' ? 'Continue to App' : 'Create My Account'}
                    </span>
                    <span className="arrow"><Icons.ArrowRight /></span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="auth-card-footer">
            <p>
              {mode === 'login' ? (
                <>
                  Don't have an account?
                  <button type="button" onClick={() => switchMode('signup')}>Sign up for free</button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button type="button" onClick={() => switchMode('login')}>Log in here</button>
                </>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
