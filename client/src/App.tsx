import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Institutes from './pages/Institutes';
import ChoiceFilling from './pages/ChoiceFilling';
import Candidates from './pages/Candidates';
import Allocations from './pages/Allocations';
import SeatMatrix from './pages/SeatMatrix';
import Ranks from './pages/Ranks';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/institutes" element={<Institutes />} />
            <Route path="/choice-filling" element={<ChoiceFilling />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/allocations" element={<Allocations />} />
            <Route path="/seat-matrix" element={<SeatMatrix />} />
            <Route path="/ranks" element={<Ranks />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>JoSAA 2025</h3>
              <p>Joint Seat Allocation Authority</p>
              <p className="footer-tagline">Empowering futures through transparent admissions</p>
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
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Important</h4>
              <ul>
                <li><a href="#">Guidelines</a></li>
                <li><a href="#">Fee Structure</a></li>
                <li><a href="#">Schedule</a></li>
                <li><a href="#">Help Desk</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 JoSAA - Joint Seat Allocation Authority. All rights reserved.</p>
            <p className="footer-disclaimer">Ministry of Education, Government of India</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
