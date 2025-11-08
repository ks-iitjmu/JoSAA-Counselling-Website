import { useState, useEffect } from 'react';
import { seatMatrixAPI } from '../services/api';
import './SeatMatrix.css';

interface SeatMatrix {
  SeatMatrixID: number;
  InstituteCode: string;
  ProgramCode: string;
  Category: string;
  TotalSeats: number;
  InstituteName?: string;
  ProgramName?: string;
  InstituteType?: string;
}

const SeatMatrix = () => {
  const [seatMatrix, setSeatMatrix] = useState<SeatMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterInstitute, setFilterInstitute] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSeatMatrix();
  }, []);

  const fetchSeatMatrix = async () => {
    try {
      setLoading(true);
      const response = await seatMatrixAPI.getAll();
      // API returns { success: true, data: [...] }
      setSeatMatrix(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch seat matrix. Please try again later.');
      console.error('Error fetching seat matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeats = seatMatrix.filter(seat => {
    const matchesSearch = 
      (seat.InstituteName && seat.InstituteName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (seat.ProgramName && seat.ProgramName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || seat.Category === filterCategory;
    const matchesInstitute = filterInstitute === 'All' || seat.InstituteType === filterInstitute;
    
    return matchesSearch && matchesCategory && matchesInstitute;
  });

  const categories = ['All', ...Array.from(new Set(seatMatrix.map(s => s.Category)))];
  const instituteTypes = ['All', ...Array.from(new Set(seatMatrix.map(s => s.InstituteType).filter(Boolean)))];

  const totalSeats = filteredSeats.reduce((sum, seat) => sum + seat.TotalSeats, 0);

  if (loading) {
    return <div className="loading">Loading seat matrix...</div>;
  }

  return (
    <div className="seat-matrix-page">
      <div className="page-header">
        <h1>Seat Matrix</h1>
        <p className="page-description">
          View available seats across all institutes and programs
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-overview">
        <div className="stat-box total">
          <div className="stat-icon">💺</div>
          <div className="stat-content">
            <div className="stat-value">{totalSeats}</div>
            <div className="stat-label">Total Seats</div>
          </div>
        </div>
        <div className="stat-box available">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{filteredSeats.length}</div>
            <div className="stat-label">Programs</div>
          </div>
        </div>
        <div className="stat-box occupied">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <div className="stat-value">{instituteTypes.length - 1}</div>
            <div className="stat-label">Institute Types</div>
          </div>
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
      </div>

      <div className="seats-count">
        Showing {filteredSeats.length} programs ({totalSeats} total seats)
      </div>

      {filteredSeats.length === 0 ? (
        <div className="no-results">
          <div className="empty-state-icon">💺</div>
          <p className="empty-state-text">No seats found</p>
          <p className="empty-state-subtext">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="seats-grid">
          {filteredSeats.map(seat => {
            return (
              <div key={seat.SeatMatrixID} className="seat-card">
                <div className="seat-header">
                  <div className="institute-info">
                    <h3>{seat.InstituteName || 'Unknown Institute'}</h3>
                    {seat.InstituteType && (
                      <span className={`institute-badge ${seat.InstituteType}`}>
                        {seat.InstituteType}
                      </span>
                    )}
                  </div>
                  <span className={`category-tag ${seat.Category}`}>
                    {seat.Category}
                  </span>
                </div>

                <div className="program-name">
                  <span className="program-icon">📚</span>
                  {seat.ProgramName || 'Unknown Program'}
                </div>

                <div className="seat-stats">
                  <div className="seat-stat-item">
                    <span className="seat-stat-label">Total Seats</span>
                    <span className="seat-stat-value total">{seat.TotalSeats}</span>
                  </div>
                  <div className="seat-stat-item">
                    <span className="seat-stat-label">Category</span>
                    <span className="seat-stat-value available">{seat.Category}</span>
                  </div>
                  <div className="seat-stat-item">
                    <span className="seat-stat-label">Seat Pool</span>
                    <span className="seat-stat-value occupied">N/A</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeatMatrix;
