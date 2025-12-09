import './Header.css';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onLoginClick, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Cover Letter Generator</h1>
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
