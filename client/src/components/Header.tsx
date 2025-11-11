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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      setIsDropdownOpen(false);
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

  const getInitials = () => {
    if (!user) return '';
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Student':
        return '#10b981';
      case 'Institute':
        return '#f97316';
      case 'Administrator':
        return '#a855f7';
      default:
        return '#666';
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <div>
              <h1>JOSAA 2025</h1>
              <p>Joint Seat Allocation Authority</p>
            </div>
          </Link>
          
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          </button>

          <nav className="nav desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            {(!isAuth || user?.role !== 'Student') && (
              <Link to="/candidates" className={`nav-link ${isActive('/candidates')}`}>Candidates</Link>
            )}
            <Link to="/institutes" className={`nav-link ${isActive('/institutes')}`}>Institutes</Link>
            {isAuth && user?.role === 'Student' && (
              <Link to="/choice-filling" className={`nav-link ${isActive('/choice-filling')}`}>Choice Filling</Link>
            )}
            <Link to="/allocations" className={`nav-link ${isActive('/allocations')}`}>Allocations</Link>
            <Link to="/seat-matrix" className={`nav-link ${isActive('/seat-matrix')}`}>Seat Matrix</Link>
            <Link to="/ranks" className={`nav-link ${isActive('/ranks')}`}>Ranks</Link>
            
            {isAuth && user ? (
              <div className="user-menu">
                <button className="avatar-button" onClick={toggleDropdown}>
                  <svg className="user-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <>
                    <div className="dropdown-overlay" onClick={closeDropdown}></div>
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">{getInitials()}</div>
                        <div className="dropdown-info">
                          <span className="dropdown-name">{getUserDisplayName()}</span>
                          <span 
                            className="dropdown-role" 
                            style={{ backgroundColor: getRoleBadgeColor(user.role) }}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        My Profile
                      </Link>
                      {user?.role === 'Administrator' && (
                        <>
                          <div className="dropdown-divider"></div>
                          <Link to="/admin/dashboard" className="dropdown-item" onClick={closeDropdown}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Admin Dashboard
                          </Link>
                        </>
                      )}
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
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
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span> Home
          </Link>
          {(!isAuth || user?.role !== 'Student') && (
            <Link to="/candidates" className={`side-nav-link ${isActive('/candidates')}`} onClick={closeMenu}>
              <span className="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span> Candidates
            </Link>
          )}
          <Link to="/institutes" className={`side-nav-link ${isActive('/institutes')}`} onClick={closeMenu}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span> Institutes
          </Link>
          {isAuth && user?.role === 'Student' && (
            <Link to="/choice-filling" className={`side-nav-link ${isActive('/choice-filling')}`} onClick={closeMenu}>
              <span className="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span> Choice Filling
            </Link>
          )}
          <Link to="/allocations" className={`side-nav-link ${isActive('/allocations')}`} onClick={closeMenu}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span> Allocations
          </Link>
          <Link to="/seat-matrix" className={`side-nav-link ${isActive('/seat-matrix')}`} onClick={closeMenu}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 10H11M7 14H17M13 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span> Seat Matrix
          </Link>
          <Link to="/ranks" className={`side-nav-link ${isActive('/ranks')}`} onClick={closeMenu}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21M21 21H3M7 16L12 11L16 15L21 10M21 10H17M21 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span> Ranks
          </Link>
          
          <div className="side-panel-divider"></div>
          
          {isAuth && user ? (
            <>
              <Link to="/profile" className={`side-nav-link ${isActive('/profile')}`} onClick={closeMenu}>
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span> My Profile
              </Link>
              {user?.role === 'Administrator' && (
                <Link to="/admin/dashboard" className={`side-nav-link ${isActive('/admin/dashboard')}`} onClick={closeMenu}>
                  <span className="nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span> Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="side-nav-link logout-mobile">
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`side-nav-link ${isActive('/login')}`} onClick={closeMenu}>
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span> Login
              </Link>
              <Link to="/register" className={`side-nav-link ${isActive('/register')}`} onClick={closeMenu}>
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 1.17157 16.1716C0.421427 16.9217 0 17.9391 0 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
