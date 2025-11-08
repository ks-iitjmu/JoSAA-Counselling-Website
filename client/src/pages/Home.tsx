import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to JoSAA 2025</h1>
        <p className="subtitle">
          Central authority for joint seat allocation in IITs, NITs, IIITs, and other Government Funded Technical Institutes
        </p>
        <div className="hero-buttons">
          <Link to="/choice-filling" className="btn-primary">Start Choice Filling</Link>
          <Link to="/institutes" className="btn-secondary">Explore Institutes</Link>
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

      <section className="features-section">
        <h2 className="section-title">Get Started</h2>
        <div className="features">
          <div className="feature-card">
            <div className="icon">�️</div>
            <h3>Participating Institutes</h3>
            <p>Browse through all participating institutes and their programs</p>
            <Link to="/institutes" className="btn">View Institutes</Link>
          </div>

          <div className="feature-card">
            <div className="icon">�</div>
            <h3>Choice Filling</h3>
            <p>Fill and lock your preferences for seat allocation</p>
            <Link to="/choice-filling" className="btn">Fill Choices</Link>
          </div>

          <div className="feature-card">
            <div className="icon">�</div>
            <h3>Seat Matrix</h3>
            <p>View available seats across institutes and programs</p>
            <Link to="/seat-matrix" className="btn">View Seats</Link>
          </div>
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

