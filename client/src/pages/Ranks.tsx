import { useState, useEffect } from 'react';
import { ranksAPI } from '../services/api';
import './Ranks.css';

interface Rank {
  OCR_ID: number;
  InstituteCode: string;
  ProgramCode: string;
  RoundID: number;
  Category: string;
  OpeningRank: number;
  ClosingRank: number;
  InstituteName?: string;
  ProgramName?: string;
  InstituteType?: string;
}

const Ranks = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRound, setFilterRound] = useState('All');
  const [filterInstitute, setFilterInstitute] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      const response = await ranksAPI.getAll();
      // API returns { success: true, data: [...] }
      setRanks(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch ranks. Please try again later.');
      console.error('Error fetching ranks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRanks = ranks.filter(rank => {
    const matchesSearch = 
      (rank.InstituteName && rank.InstituteName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rank.ProgramName && rank.ProgramName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || rank.Category === filterCategory;
    const matchesRound = filterRound === 'All' || rank.RoundID.toString() === filterRound;
    const matchesInstitute = filterInstitute === 'All' || rank.InstituteType === filterInstitute;
    
    return matchesSearch && matchesCategory && matchesRound && matchesInstitute;
  });

  const categories = ['All', ...Array.from(new Set(ranks.map(r => r.Category)))];
  const rounds = ['All', ...Array.from(new Set(ranks.map(r => r.RoundID.toString())))];
  const instituteTypes = ['All', ...Array.from(new Set(ranks.map(r => r.InstituteType).filter(Boolean)))];

  if (loading) {
    return <div className="loading">Loading opening and closing ranks...</div>;
  }

  return (
    <div className="ranks-page">
      <div className="page-header">
        <h1>Opening & Closing Ranks</h1>
        <p className="page-description">
          View cutoff ranks for all programs across institutes
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="info-banner">
        <div className="info-icon">ℹ️</div>
        <div className="info-content">
          <strong>Understanding Ranks:</strong> Opening rank is the highest rank (lowest number) 
          that got admitted, and closing rank is the lowest rank (highest number) that got admitted 
          in a specific category and round.
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by institute or program..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterInstitute}
          onChange={(e) => setFilterInstitute(e.target.value)}
        >
          {instituteTypes.map(type => (
            <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filterRound}
          onChange={(e) => setFilterRound(e.target.value)}
        >
          {rounds.map(round => (
            <option key={round} value={round}>
              {round === 'All' ? 'All Rounds' : `Round ${round}`}
            </option>
          ))}
        </select>
      </div>

      <div className="ranks-count">
        Showing {filteredRanks.length} of {ranks.length} rank entries
      </div>

      {filteredRanks.length === 0 ? (
        <div className="no-results">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-text">No ranks found</p>
          <p className="empty-state-subtext">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="ranks-grid">
          {filteredRanks.map(rank => (
            <div key={rank.OCR_ID} className="rank-card">
              <div className="rank-header">
                <div className="institute-section">
                  <h3>{rank.InstituteName || 'Unknown Institute'}</h3>
                  {rank.InstituteType && (
                    <span className={`institute-badge ${rank.InstituteType}`}>
                      {rank.InstituteType}
                    </span>
                  )}
                </div>
                <div className="badges-section">
                  <span className={`category-badge ${rank.Category}`}>
                    {rank.Category}
                  </span>
                  <span className="round-badge">
                    R{rank.RoundID}
                  </span>
                </div>
              </div>

              <div className="program-section">
                <span className="program-icon">📚</span>
                <span className="program-name">
                  {rank.ProgramName || 'Unknown Program'}
                </span>
              </div>

              <div className="ranks-display">
                <div className="rank-box opening">
                  <div className="rank-label">Opening Rank</div>
                  <div className="rank-number">{rank.OpeningRank.toLocaleString()}</div>
                  <div className="rank-subtitle">Highest admitted</div>
                </div>
                
                <div className="rank-separator">
                  <div className="separator-line"></div>
                  <div className="separator-icon">➜</div>
                  <div className="separator-line"></div>
                </div>

                <div className="rank-box closing">
                  <div className="rank-label">Closing Rank</div>
                  <div className="rank-number">{rank.ClosingRank.toLocaleString()}</div>
                  <div className="rank-subtitle">Lowest admitted</div>
                </div>
              </div>

              <div className="rank-range">
                <div className="range-label">Rank Range</div>
                <div className="range-value">
                  {(rank.ClosingRank - rank.OpeningRank + 1).toLocaleString()} ranks
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranks;
