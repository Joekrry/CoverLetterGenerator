import './Header.css';


const Header = ({ onLoginClick }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Cover Letter Generator</h1>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <button
                className="login-btn"
                onClick={onLoginClick}
              >
                Login
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
