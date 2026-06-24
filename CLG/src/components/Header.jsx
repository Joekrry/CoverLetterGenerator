import { useRef } from 'react';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onLoginClick, onMenuClick }) => {
  const { user, bypassLogin } = useAuth();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleTitleClick = () => {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      bypassLogin();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1 onClick={handleTitleClick} style={{ cursor: 'default', userSelect: 'none' }}>Cover Letter Generator</h1>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li>
              {user && (
                <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
                  <i className="fas fa-bars"></i>
                </button>
              )}
            </li>
            <li>
              {user ? (
                <button className="login-btn" onClick={onLoginClick} style={{ display: 'none' }}>
                  Login
                </button>
              ) : (
                <button className="login-btn" onClick={onLoginClick}>
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
