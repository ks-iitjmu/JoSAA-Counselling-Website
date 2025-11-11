import { Link } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, isStudent, isInstitute, isAdmin } from '../utils/auth';
import './Home.css';

const Home = () => {
  const user = getCurrentUser();
  const isAuth = isAuthenticated();

  const getGreeting = () => {
    if (!isAuth || !user) return 'Welcome to JoSAA 2025';
    const name = user.studentName || user.instituteName || user.username;
    return `Welcome back, ${name}!`;
  };

  const getRoleBasedSubtitle = () => {
    if (!isAuth) {
      return 'Central authority for joint seat allocation in IITs, NITs, IIITs, and other Government Funded Technical Institutes';
    }
    if (isStudent()) {
      return 'Manage your choices, view allocations, and track your counselling progress';
    }
    if (isInstitute()) {
      return 'Manage your institute information and view participating students';
    }
    if (isAdmin()) {
      return 'System administration and oversight of the counselling process';
    }
    return 'Joint Seat Allocation Authority - Academic Year 2025-26';
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>{getGreeting()}</h1>
        <p className="subtitle">{getRoleBasedSubtitle()}</p>
        <div className="hero-buttons">
          {!isAuth ? (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Register Now</Link>
            </>
          ) : isStudent() ? (
            <>
              <Link to="/choice-filling" className="btn-primary">Fill Choices</Link>
              <Link to="/allocations" className="btn-secondary">View Allocations</Link>
            </>
          ) : (
            <>
              <Link to="/institutes" className="btn-primary">View Institutes</Link>
              <Link to="/seat-matrix" className="btn-secondary">Seat Matrix</Link>
            </>
          )}
        </div>
      </div>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">114</div>
            <div className="stat-label">Participating Institutes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">23</div>
            <div className="stat-label">IITs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">31</div>
            <div className="stat-label">NITs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">26</div>
            <div className="stat-label">IIITs</div>
          </div>
        </div>
      </section>

      {isAuth && (
        <section className="dashboard-section">
          <h2 className="section-title">Your Dashboard</h2>
          <div className="dashboard-cards">
            {isStudent() && user?.candidateID && (
              <>
                <div className="info-card student-card">
                  <div className="info-label">Candidate ID</div>
                  <div className="info-value">{user.candidateID}</div>
                </div>
                <div className="info-card student-card">
                  <div className="info-label">JEE Mains AIR</div>
                  <div className="info-value">{user.jeeMainsAIR || 'N/A'}</div>
                </div>
                <div className="info-card student-card">
                  <div className="info-label">Email</div>
                  <div className="info-value">{user.studentEmail || user.email}</div>
                </div>
              </>
            )}
            {isInstitute() && user?.instituteCode && (
              <>
                <div className="info-card institute-card">
                  <div className="info-label">Institute Code</div>
                  <div className="info-value">{user.instituteCode}</div>
                </div>
                <div className="info-card institute-card">
                  <div className="info-label">Institute Name</div>
                  <div className="info-value">{user.instituteName}</div>
                </div>
                <div className="info-card institute-card">
                  <div className="info-label">Contact</div>
                  <div className="info-value">{user.institutePhone || 'N/A'}</div>
                </div>
              </>
            )}
            {isAdmin() && (
              <div className="info-card admin-card">
                <div className="info-label">Access Level</div>
                <div className="info-value">Administrator</div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="features-section">
        <h2 className="section-title">Quick Access</h2>
        <div className="features">
          <div className="feature-card">
            <div className="icon-wrapper">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Participating Institutes</h3>
            <p>Browse through all participating institutes and their programs</p>
            <Link to="/institutes" className="btn">View Institutes</Link>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 10H11M7 14H17M13 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Seat Matrix</h3>
            <p>View available seats across institutes and programs</p>
            <Link to="/seat-matrix" className="btn">View Seats</Link>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21M21 21H3M7 16L12 11L16 15L21 10M21 10H17M21 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Opening/Closing Ranks</h3>
            <p>Check previous year cutoff ranks for various programs</p>
            <Link to="/ranks" className="btn">View Ranks</Link>
          </div>

          {isStudent() && (
            <>
              <div className="feature-card student-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Choice Filling</h3>
                <p>Fill and lock your preferences for seat allocation</p>
                <Link to="/choice-filling" className="btn btn-primary">Fill Choices</Link>
              </div>

              <div className="feature-card student-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>My Allocations</h3>
                <p>View your seat allocation status and results</p>
                <Link to="/allocations" className="btn btn-primary">View Allocations</Link>
              </div>

              <div className="feature-card student-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>My Profile</h3>
                <p>View and manage your candidate information</p>
                <Link to="/candidates" className="btn btn-primary">View Profile</Link>
              </div>
            </>
          )}

          {isInstitute() && (
            <>
              <div className="feature-card institute-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 10V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V10C2 10.5304 2.21071 11.0391 2.58579 11.4142C2.96086 11.7893 3.46957 12 4 12H20C20.5304 12 21.0391 11.7893 21.4142 11.4142C21.7893 11.0391 22 10.5304 22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12L12 20M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Our Programs</h3>
                <p>Manage programs and seats for your institute</p>
                <Link to="/institutes" className="btn btn-primary">View Programs</Link>
              </div>

              <div className="feature-card institute-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Allocated Candidates</h3>
                <p>View students allocated to your institute</p>
                <Link to="/allocations" className="btn btn-primary">View Candidates</Link>
              </div>
            </>
          )}

          {isAdmin() && (
            <>
              <div className="feature-card admin-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>All Candidates</h3>
                <p>View and manage all registered candidates</p>
                <Link to="/candidates" className="btn btn-primary">Manage Candidates</Link>
              </div>

              <div className="feature-card admin-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>All Institutes</h3>
                <p>View and manage all participating institutes</p>
                <Link to="/institutes" className="btn btn-primary">Manage Institutes</Link>
              </div>

              <div className="feature-card admin-only">
                <div className="icon-wrapper">
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>System Overview</h3>
                <p>View system statistics and allocation progress</p>
                <Link to="/allocations" className="btn btn-primary">View System</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="info-section">
        <h2>About JoSAA</h2>
        <p>
          The Joint Seat Allocation Authority (JoSAA) has been set up by the Ministry of Education 
          to conduct the joint seat allocation process for admissions to 114 institutes for the academic year 2025-26.
        </p>
        <p>
          This includes 23 IITs, 31 NITs, 26 IIITs and 34 Other-Government Funded Technical Institutes (Other-GFTIs). 
          Admission to all the academic programs offered by these Institutes will be made through a single platform.
        </p>
      </section>
    </div>
  );
};

export default Home;

