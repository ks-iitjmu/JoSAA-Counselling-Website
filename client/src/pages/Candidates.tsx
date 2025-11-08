import { useState, useEffect } from 'react';
import { candidateAPI } from '../services/api';
import './Candidates.css';

interface Candidate {
  CandidateID: number;
  Name: string;
  EmailAddress: string;
  MobileNumber: string;
  DateOfBirth: string;
  Gender: string;
  Category: string;
  JEE_Mains_AIR?: number;
  JEE_Advanced_Qualifying_status?: string;
}

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateAPI.getAll();
      // API returns { success: true, data: [...] }
      setCandidates(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch candidates. Please try again later.');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.EmailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.CandidateID.toString().includes(searchTerm);
    
    const matchesCategory = filterCategory === 'All' || candidate.Category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(candidates.map(c => c.Category)))];

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  return (
    <div className="candidates-page">
      <div className="page-header">
        <h1>Registered Candidates</h1>
        <p className="page-description">
          View all registered candidates for JoSAA 2025 counselling
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or candidate ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat} Category</option>
          ))}
        </select>
      </div>

      <div className="candidates-count">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="no-results">
          <div className="empty-state-icon">👤</div>
          <p className="empty-state-text">No candidates found</p>
          <p className="empty-state-subtext">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {filteredCandidates.map(candidate => (
            <div key={candidate.CandidateID} className="candidate-card">
              <div className="candidate-header">
                <div className="candidate-avatar">
                  {candidate.Name.charAt(0).toUpperCase()}
                </div>
                <div className="candidate-info">
                  <h3>{candidate.Name}</h3>
                  <span className="candidate-id">ID: {candidate.CandidateID}</span>
                </div>
                <span className={`category-badge ${candidate.Category}`}>
                  {candidate.Category}
                </span>
              </div>
              
              <div className="candidate-details">
                <div className="detail-row">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{candidate.EmailAddress}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📱 Phone:</span>
                  <span className="detail-value">{candidate.MobileNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🎂 DOB:</span>
                  <span className="detail-value">{new Date(candidate.DateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⚧ Gender:</span>
                  <span className="detail-value">{candidate.Gender}</span>
                </div>
              </div>

              <div className="ranks-section">
                <div className="rank-item">
                  <span className="rank-label">JEE Mains Rank</span>
                  <span className="rank-value">
                    {candidate.JEE_Mains_AIR || 'N/A'}
                  </span>
                </div>
                <div className="rank-item">
                  <span className="rank-label">JEE Advanced</span>
                  <span className="rank-value">
                    {candidate.JEE_Advanced_Qualifying_status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Candidates;
