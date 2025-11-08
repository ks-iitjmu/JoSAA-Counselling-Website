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
          <p>&copy; 2025 JOSAA - Joint Seat Allocation Authority. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
