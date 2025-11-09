import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>JOSAA 2025</h1>
            <p>Joint Seat Allocation Authority</p>
          </div>
          
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          </button>

          <nav className="nav desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            <Link to="/candidates" className={`nav-link ${isActive('/candidates')}`}>Candidates</Link>
            <Link to="/institutes" className={`nav-link ${isActive('/institutes')}`}>Institutes</Link>
            <Link to="/choice-filling" className={`nav-link ${isActive('/choice-filling')}`}>Choice Filling</Link>
            <Link to="/allocations" className={`nav-link ${isActive('/allocations')}`}>Allocations</Link>
            <Link to="/seat-matrix" className={`nav-link ${isActive('/seat-matrix')}`}>Seat Matrix</Link>
            <Link to="/ranks" className={`nav-link ${isActive('/ranks')}`}>Opening/Closing Ranks</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Side Panel */}
      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      <div className={`side-panel ${isMenuOpen ? 'active' : ''}`}>
        <div className="side-panel-header">
          <div className="side-panel-logo">
            <h2>JOSAA 2025</h2>
            <p>Joint Seat Allocation Authority</p>
          </div>
          <button className="close-btn" onClick={closeMenu} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="side-panel-nav">
          <Link to="/" className={`side-nav-link ${isActive('/')}`} onClick={closeMenu}>
            <span className="nav-icon">🏠</span> Home
          </Link>
          <Link to="/candidates" className={`side-nav-link ${isActive('/candidates')}`} onClick={closeMenu}>
            <span className="nav-icon">👥</span> Candidates
          </Link>
          <Link to="/institutes" className={`side-nav-link ${isActive('/institutes')}`} onClick={closeMenu}>
            <span className="nav-icon">🏛️</span> Institutes
          </Link>
          <Link to="/choice-filling" className={`side-nav-link ${isActive('/choice-filling')}`} onClick={closeMenu}>
            <span className="nav-icon">📝</span> Choice Filling
          </Link>
          <Link to="/allocations" className={`side-nav-link ${isActive('/allocations')}`} onClick={closeMenu}>
            <span className="nav-icon">✅</span> Allocations
          </Link>
          <Link to="/seat-matrix" className={`side-nav-link ${isActive('/seat-matrix')}`} onClick={closeMenu}>
            <span className="nav-icon">💺</span> Seat Matrix
          </Link>
          <Link to="/ranks" className={`side-nav-link ${isActive('/ranks')}`} onClick={closeMenu}>
            <span className="nav-icon">📊</span> Opening/Closing Ranks
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
