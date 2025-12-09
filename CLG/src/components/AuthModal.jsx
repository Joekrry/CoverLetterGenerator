import React, { useState } from 'react';
import './AuthModal.css';


const AuthModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-box">
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        <h2 className="auth-modal-title">{isRegister ? 'Register' : 'Log in'}</h2>
        <div className="auth-modal-subtext">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <a href="#" className="auth-modal-link" onClick={e => { e.preventDefault(); setIsRegister(false); }}>Log in</a>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <a href="#" className="auth-modal-link" onClick={e => { e.preventDefault(); setIsRegister(true); }}>Create an account</a>
            </>
          )}
        </div>
        <form className="auth-form">
          <label htmlFor="auth-email" className="auth-label">Username or Email</label>
          <input id="auth-email" type="email" required className="auth-input" />
          <label htmlFor="auth-password" className="auth-label">Password</label>
          <div className="auth-password-wrapper">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              required
              className="auth-input"
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
              <input id="auth-password-confirm" type={showPassword ? 'text' : 'password'} required className="auth-input" />
            </>
          )}
          {!isRegister && (
            <div className="auth-checkbox-row">
              <input type="checkbox" id="keep-logged-in" className="auth-checkbox" />
              <label htmlFor="keep-logged-in" className="auth-checkbox-label">Keep me logged in</label>
            </div>
          )}
          <button type="submit" className="auth-form-login-btn">{isRegister ? 'Register' : 'Log in'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
