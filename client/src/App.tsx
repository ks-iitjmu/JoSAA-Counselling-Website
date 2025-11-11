import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Institutes from './pages/Institutes';
import ChoiceFilling from './pages/ChoiceFilling';
import Candidates from './pages/Candidates';
import Allocations from './pages/Allocations';
import SeatMatrix from './pages/SeatMatrix';
import Ranks from './pages/Ranks';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/institutes" element={<Institutes />} />
            <Route path="/choice-filling" element={<ChoiceFilling />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/allocations" element={<Allocations />} />
            <Route path="/seat-matrix" element={<SeatMatrix />} />
            <Route path="/ranks" element={<Ranks />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/candidates" element={<Candidates />} />
            <Route path="/admin/allocations" element={<Allocations />} />
            <Route path="/admin/institutes" element={<Institutes />} />
            <Route path="/admin/programs" element={<Institutes />} />
            <Route path="/admin/ranks" element={<Ranks />} />
            <Route path="/admin/rounds" element={<Allocations />} />
            
            {/* Legacy dashboard routes */}
            <Route path="/student-dashboard" element={<Home />} />
            <Route path="/institute-dashboard" element={<Home />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section footer-brand">
              <h3>JoSAA 2025</h3>
              <p className="footer-subtitle">Joint Seat Allocation Authority</p>
              <p className="footer-tagline">Empowering futures through transparent admissions</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.28444C14.0247 3.6117 13.2884 4.19439 12.773 4.95372C12.2575 5.71305 11.9877 6.61232 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" aria-label="Email">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/institutes">Participating Institutes</a></li>
                <li><a href="/seat-matrix">Seat Matrix</a></li>
                <li><a href="/ranks">Opening/Closing Ranks</a></li>
                <li><a href="/choice-filling">Choice Filling</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="/candidates">Candidate Information</a></li>
                <li><a href="/allocations">Seat Allocations</a></li>
                <li><a href="#">Guidelines & FAQs</a></li>
                <li><a href="#">Contact Support</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Important</h4>
              <ul>
                <li><a href="#">Admission Guidelines</a></li>
                <li><a href="#">Fee Structure</a></li>
                <li><a href="#">Counselling Schedule</a></li>
                <li><a href="#">24/7 Help Desk</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                &copy; 2025 JoSAA - Joint Seat Allocation Authority. All rights reserved.
              </p>
              <p className="footer-disclaimer">
                <span className="badge">Ministry of Education</span> Government of India
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
