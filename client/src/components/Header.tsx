import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>JOSAA 2025</h1>
          <p>Joint Seat Allocation Authority</p>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/candidates" className="nav-link">Candidates</Link>
          <Link to="/institutes" className="nav-link">Institutes</Link>
          <Link to="/choice-filling" className="nav-link">Choice Filling</Link>
          <Link to="/allocations" className="nav-link">Allocations</Link>
          <Link to="/seat-matrix" className="nav-link">Seat Matrix</Link>
          <Link to="/ranks" className="nav-link">Opening/Closing Ranks</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
