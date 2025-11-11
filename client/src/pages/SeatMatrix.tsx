import { useState, useEffect } from 'react';
import { seatMatrixAPI } from '../services/api';
import './SeatMatrix.css';

interface SeatMatrix {
  SeatMatrixID: number;
  InstituteCode: string;
  ProgramCode: string;
  SeatPool: string;
  Quota: string;
  Category: string;
  TotalSeats: number;
  InstituteName?: string;
  ProgramName?: string;
  InstituteType?: string;
}

interface EditFormData {
  SeatPool: string;
  Quota: string;
  Category: string;
  TotalSeats: number;
  oldSeatPool: string;
  oldQuota: string;
  oldCategory: string;
}

const SeatMatrix = () => {
  const [seatMatrix, setSeatMatrix] = useState<SeatMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterInstitute, setFilterInstitute] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSeat, setEditingSeat] = useState<SeatMatrix | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    SeatPool: '',
    Quota: '',
    Category: '',
    TotalSeats: 0,
    oldSeatPool: '',
    oldQuota: '',
    oldCategory: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isInstitute = () => user?.role === 'Institute';
  const isAdmin = () => user?.role === 'Administrator';

  useEffect(() => {
    fetchSeatMatrix();
  }, []);

  const fetchSeatMatrix = async () => {
    try {
      setLoading(true);
      let response;
      
      // If institute user, fetch only their seat matrix
      if (isInstitute() && user.instituteCode) {
        response = await seatMatrixAPI.getByInstitute(user.instituteCode);
      } else {
        // Admin or public - fetch all
        response = await seatMatrixAPI.getAll();
      }
      
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

  const handleEditClick = (seat: SeatMatrix) => {
    // Check if user can edit this seat
    if (isInstitute() && seat.InstituteCode !== user.instituteCode) {
      setError('You can only edit seat matrix for your own institute');
      return;
    }
    
    setEditingSeat(seat);
    setEditFormData({
      SeatPool: seat.SeatPool,
      Quota: seat.Quota,
      Category: seat.Category,
      TotalSeats: seat.TotalSeats,
      oldSeatPool: seat.SeatPool,
      oldQuota: seat.Quota,
      oldCategory: seat.Category
    });
    setShowEditModal(true);
    setError('');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeat) return;

    try {
      setLoading(true);
      await seatMatrixAPI.update(
        editingSeat.InstituteCode,
        editingSeat.ProgramCode,
        editFormData
      );
      setUpdateMessage('Seat matrix updated successfully!');
      setShowEditModal(false);
      setEditingSeat(null);
      fetchSeatMatrix(); // Refresh the list
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update seat matrix');
      console.error('Error updating seat matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const canEditSeat = (seat: SeatMatrix) => {
    if (isAdmin()) return true;
    if (isInstitute() && seat.InstituteCode === user.instituteCode) return true;
    return false;
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
          {isInstitute() 
            ? `Manage seat matrix for ${user.instituteName || user.instituteCode}`
            : 'View available seats across all institutes and programs'
          }
        </p>
      </div>

      {error && <div className="error">{error}</div>}
      {updateMessage && <div className="success-message">{updateMessage}</div>}

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
          placeholder={isInstitute() ? "Search by program..." : "Search by institute or program..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {!isInstitute() && (
          <select
            className="filter-select"
            value={filterInstitute}
            onChange={(e) => setFilterInstitute(e.target.value)}
          >
            {instituteTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
            ))}
          </select>
        )}
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
                    <span className="seat-stat-label">Seat Pool</span>
                    <span className="seat-stat-value available">{seat.SeatPool}</span>
                  </div>
                  <div className="seat-stat-item">
                    <span className="seat-stat-label">Quota</span>
                    <span className="seat-stat-value occupied">{seat.Quota}</span>
                  </div>
                </div>

                {canEditSeat(seat) && (
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEditClick(seat)}
                    title="Edit seat matrix"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSeat && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Seat Matrix</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Institute</label>
                <input 
                  type="text" 
                  value={editingSeat.InstituteName || editingSeat.InstituteCode} 
                  disabled 
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label>Program</label>
                <input 
                  type="text" 
                  value={editingSeat.ProgramName || editingSeat.ProgramCode} 
                  disabled 
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label>Seat Pool</label>
                <input
                  type="text"
                  value={editFormData.SeatPool}
                  onChange={(e) => setEditFormData({ ...editFormData, SeatPool: e.target.value })}
                  required
                  placeholder="e.g., AI, HS, OS"
                />
              </div>

              <div className="form-group">
                <label>Quota</label>
                <input
                  type="text"
                  value={editFormData.Quota}
                  onChange={(e) => setEditFormData({ ...editFormData, Quota: e.target.value })}
                  required
                  placeholder="e.g., OS, HS"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editFormData.Category}
                  onChange={(e) => setEditFormData({ ...editFormData, Category: e.target.value })}
                  required
                >
                  <option value="OPEN">OPEN</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="GEN-PwD">GEN-PwD</option>
                  <option value="OBC-PwD">OBC-PwD</option>
                  <option value="SC-PwD">SC-PwD</option>
                  <option value="ST-PwD">ST-PwD</option>
                </select>
              </div>

              <div className="form-group">
                <label>Total Seats</label>
                <input
                  type="number"
                  value={editFormData.TotalSeats}
                  onChange={(e) => setEditFormData({ ...editFormData, TotalSeats: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMatrix;
