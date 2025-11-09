import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, isAuthenticated } from '../services/api';
import './Header.css';

interface User {
  userID: number;
  username: string;
  role: string;
  email: string;
  studentName?: string;
  instituteName?: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount and location change
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
      setUser(getCurrentUser());
    };
    checkAuth();
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuth(false);
      navigate('/');
      closeMenu();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.studentName || user.instituteName || user.username;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Student':
        return '#667eea';
      case 'Institute':
        return '#f093fb';
      case 'Administrator':
        return '#fa709a';
      default:
        return '#666';
    }
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
            <Link to="/ranks" className={`nav-link ${isActive('/ranks')}`}>Ranks</Link>
            
            {isAuth && user ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span 
                    className="user-role-badge" 
                    style={{ backgroundColor: getRoleBadgeColor(user.role) }}
                  >
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link login-link">Login</Link>
                <Link to="/register" className="nav-link register-link">Register</Link>
              </div>
            )}
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
        
        {isAuth && user && (
          <div className="side-panel-user">
            <div className="user-avatar">{getUserDisplayName().charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{getUserDisplayName()}</span>
              <span 
                className="user-role-badge" 
                style={{ backgroundColor: getRoleBadgeColor(user.role) }}
              >
                {user.role}
              </span>
            </div>
          </div>
        )}
        
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
            <span className="nav-icon">📊</span> Ranks
          </Link>
          
          <div className="side-panel-divider"></div>
          
          {isAuth && user ? (
            <button onClick={handleLogout} className="side-nav-link logout-mobile">
              <span className="nav-icon">🚪</span> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={`side-nav-link ${isActive('/login')}`} onClick={closeMenu}>
                <span className="nav-icon">🔐</span> Login
              </Link>
              <Link to="/register" className={`side-nav-link ${isActive('/register')}`} onClick={closeMenu}>
                <span className="nav-icon">📝</span> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
