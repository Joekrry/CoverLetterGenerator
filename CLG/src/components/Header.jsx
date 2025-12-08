import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Cover Letter Generator</h1>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><a href="#login">Login</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
