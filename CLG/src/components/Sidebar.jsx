import { useEffect } from 'react';
import './Sidebar.css';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose, onShowCoverLetters }) => {
  const { user, logout } = useAuth();

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCoverLettersClick = () => {
    if (onShowCoverLetters) {
      onShowCoverLetters();
    }
    onClose(); // Close sidebar when opening cover letters modal
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="sidebar-content">
          {/* Profile Section */}
          {user && (
            <div className="sidebar-profile">
              <div className="profile-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="profile-info">
                <p className="profile-email">{user.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="sidebar-nav">
            {user && (
              <>
                <button className="sidebar-nav-item" onClick={handleCoverLettersClick}>
                  <i className="fas fa-file-alt"></i>
                  <span>My Cover Letters</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className="sidebar-divider"></div>
                <button className="sidebar-nav-item" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            )}
            {!user && (
              <p className="sidebar-login-prompt">Please log in to access your cover letters</p>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
