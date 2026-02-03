import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoggingIn, isRegistering, loginError, registerError } = useAuth();

  if (!isOpen) return null;

  const isLoading = isLoggingIn || isRegistering;
  const currentError = loginError || registerError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
    }

    try {
      if (isRegister) {
        await register({ email, password });
      } else {
        await login({ email, password });
      }
      
      // Success - close modal and reset form
      onClose();
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsRegister(false);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleSwitchMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  // Display error from mutation or local validation
  const displayError = error || (currentError?.message);

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-box">
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        <h2 className="auth-modal-title">{isRegister ? 'Register' : 'Log in'}</h2>
        <div className="auth-modal-subtext">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <a href="#" className="auth-modal-link" onClick={e => { e.preventDefault(); handleSwitchMode(); }}>Log in</a>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <a href="#" className="auth-modal-link" onClick={e => { e.preventDefault(); handleSwitchMode(); }}>Create an account</a>
            </>
          )}
        </div>
        {displayError && (
          <div className="auth-error-message">
            {displayError}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-email" className="auth-label">Email</label>
          <input
            id="auth-email"
            type="email"
            required
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="test@example.com"
          />
          <label htmlFor="auth-password" className="auth-label">Password</label>
          <div className="auth-password-wrapper">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              required
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              minLength={isRegister ? 8 : undefined}
              placeholder={isRegister ? "Minimum 8 characters" : "password123"}
            />
            <span
              className="auth-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          {isRegister && (
            <>
              <label htmlFor="auth-password-confirm" className="auth-label">Confirm Password</label>
              <input
                id="auth-password-confirm"
                type={showPassword ? 'text' : 'password'}
                required
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Confirm your password"
              />
            </>
          )}
          {!isRegister && (
            <div className="auth-checkbox-row">
              <input type="checkbox" id="keep-logged-in" className="auth-checkbox" />
              <label htmlFor="keep-logged-in" className="auth-checkbox-label">Keep me logged in</label>
            </div>
          )}
          <button
            type="submit"
            className="auth-form-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isRegister ? 'Register' : 'Log in')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
