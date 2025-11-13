import { useState, useEffect } from 'react';
import { ranksAPI, instituteAPI, seatMatrixAPI, counsellingRoundAPI } from '../services/api';
import { isAdmin } from '../utils/auth';
import './Ranks.css';

interface Rank {
  OCR_ID: number;
  InstituteCode: string;
  ProgramCode: string;
  RoundID: number;
  SeatPool?: string;
  Quota?: string;
  Category: string;
  OpeningRank: number;
  ClosingRank: number;
  InstituteName?: string;
  ProgramName?: string;
  InstituteType?: string;
  StartDate?: string;
  EndDate?: string;
}

interface Institute {
  InstituteCode: string;
  InstituteName: string;
  InstituteType: string;
}

interface Program {
  ProgramCode: string;
  ProgramName: string;
}

interface Round {
  RoundID: number;
  StartDate: string;
  EndDate: string;
}

const Ranks = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRound, setFilterRound] = useState('All');
  const [filterInstitute, setFilterInstitute] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Admin state
  const [showModal, setShowModal] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [formData, setFormData] = useState({
    RoundID: 1,
    InstituteCode: '',
    ProgramCode: '',
    SeatPool: 'Gender-Neutral',
    Quota: 'AI',
    Category: 'OPEN',
    OpeningRank: 0,
    ClosingRank: 0
  });

  const adminUser = isAdmin();

  useEffect(() => {
    fetchRanks();
    if (adminUser) {
      fetchInstitutes();
      fetchRounds();
    }
  }, []);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      const response = await ranksAPI.getAll();
      setRanks(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch ranks. Please try again later.');
      console.error('Error fetching ranks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutes = async () => {
    try {
      const response = await instituteAPI.getAll();
      setInstitutes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    }
  };

  const fetchRounds = async () => {
    try {
      const response = await counsellingRoundAPI.getAll();
      setRounds(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rounds:', error);
    }
  };

  const fetchProgramsByInstitute = async (instituteCode: string) => {
    if (!instituteCode) {
      setPrograms([]);
      return;
    }

    setLoadingPrograms(true);
    try {
      const response = await seatMatrixAPI.getByInstitute(instituteCode);
      const uniquePrograms = response.data.data.reduce((acc: Program[], curr: any) => {
        const exists = acc.find(p => p.ProgramCode === curr.ProgramCode);
        if (!exists) {
          acc.push({
            ProgramCode: curr.ProgramCode,
            ProgramName: curr.ProgramName
          });
        }
        return acc;
      }, []);
      setPrograms(uniquePrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleInstituteChange = (instituteCode: string) => {
    setFormData({ ...formData, InstituteCode: instituteCode, ProgramCode: '' });
    fetchProgramsByInstitute(instituteCode);
  };

  const openCreateModal = () => {
    setEditingRank(null);
    setFormData({
      RoundID: rounds.length > 0 ? rounds[0].RoundID : 1,
      InstituteCode: '',
      ProgramCode: '',
      SeatPool: 'Gender-Neutral',
      Quota: 'AI',
      Category: 'OPEN',
      OpeningRank: 0,
      ClosingRank: 0
    });
    setPrograms([]);
    setShowModal(true);
  };

  const openEditModal = (rank: Rank) => {
    setEditingRank(rank);
    setFormData({
      RoundID: rank.RoundID,
      InstituteCode: rank.InstituteCode,
      ProgramCode: rank.ProgramCode,
      SeatPool: rank.SeatPool || 'Gender-Neutral',
      Quota: rank.Quota || 'AI',
      Category: rank.Category,
      OpeningRank: rank.OpeningRank,
      ClosingRank: rank.ClosingRank
    });
    fetchProgramsByInstitute(rank.InstituteCode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRank(null);
    setFormData({
      RoundID: 1,
      InstituteCode: '',
      ProgramCode: '',
      SeatPool: 'Gender-Neutral',
      Quota: 'AI',
      Category: 'OPEN',
      OpeningRank: 0,
      ClosingRank: 0
    });
    setPrograms([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.InstituteCode || !formData.ProgramCode || formData.OpeningRank <= 0 || formData.ClosingRank <= 0) {
      alert('Please fill all required fields with valid values');
      return;
    }

    if (formData.OpeningRank > formData.ClosingRank) {
      alert('Opening rank must be less than or equal to closing rank');
      return;
    }

    try {
      if (editingRank) {
        await ranksAPI.update(editingRank.OCR_ID, formData);
        alert('Rank entry updated successfully!');
      } else {
        await ranksAPI.create(formData);
        alert('Rank entry created successfully!');
      }
      closeModal();
      fetchRanks();
    } catch (error: any) {
      console.error('Error saving rank:', error);
      alert(error.response?.data?.message || 'Failed to save rank entry');
    }
  };

  const handleDelete = async (ocrId: number) => {
    if (!confirm('Are you sure you want to delete this rank entry?')) return;

    try {
      await ranksAPI.delete(ocrId);
      alert('Rank entry deleted successfully!');
      fetchRanks();
    } catch (error: any) {
      console.error('Error deleting rank:', error);
      alert(error.response?.data?.message || 'Failed to delete rank entry');
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
  const roundOptions = ['All', ...Array.from(new Set(ranks.map(r => r.RoundID.toString())))];
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

      {adminUser && (
        <div className="add-rank-section">
          <button className="add-rank-btn" onClick={openCreateModal}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
            </svg>
            Add New Rank Entry
          </button>
        </div>
      )}

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
          {roundOptions.map(round => (
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

              {adminUser && (
                <div className="rank-actions">
                  <button className="edit-btn" onClick={() => openEditModal(rank)}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(rank.OCR_ID)}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRank ? 'Edit Rank Entry' : 'Add New Rank Entry'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Counselling Round *</label>
                    <select
                      className="input-field"
                      value={formData.RoundID}
                      onChange={(e) => setFormData({ ...formData, RoundID: parseInt(e.target.value) })}
                      required
                    >
                      {rounds.map(round => (
                        <option key={round.RoundID} value={round.RoundID}>
                          Round {round.RoundID} ({new Date(round.StartDate).toLocaleDateString()} - {new Date(round.EndDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Institute *</label>
                    <select
                      className="input-field"
                      value={formData.InstituteCode}
                      onChange={(e) => handleInstituteChange(e.target.value)}
                      required
                    >
                      <option value="">Select Institute</option>
                      {institutes.map(inst => (
                        <option key={inst.InstituteCode} value={inst.InstituteCode}>
                          {inst.InstituteName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Program *</label>
                    <select
                      className="input-field"
                      value={formData.ProgramCode}
                      onChange={(e) => setFormData({ ...formData, ProgramCode: e.target.value })}
                      disabled={!formData.InstituteCode || loadingPrograms}
                      required
                    >
                      <option value="">
                        {loadingPrograms ? 'Loading programs...' : 'Select Program'}
                      </option>
                      {programs.map(prog => (
                        <option key={prog.ProgramCode} value={prog.ProgramCode}>
                          {prog.ProgramName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Seat Pool *</label>
                    <select
                      className="input-field"
                      value={formData.SeatPool}
                      onChange={(e) => setFormData({ ...formData, SeatPool: e.target.value })}
                      required
                    >
                      <option value="Gender-Neutral">Gender-Neutral</option>
                      <option value="Female-Only">Female-Only</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quota *</label>
                    <select
                      className="input-field"
                      value={formData.Quota}
                      onChange={(e) => setFormData({ ...formData, Quota: e.target.value })}
                      required
                    >
                      <option value="AI">AI (All India)</option>
                      <option value="HS">HS (Home State)</option>
                      <option value="OS">OS (Other State)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="input-field"
                      value={formData.Category}
                      onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
                      required
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="OBC-NCL">OBC-NCL</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                      <option value="PwD">PwD</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Opening Rank *</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.OpeningRank}
                      onChange={(e) => setFormData({ ...formData, OpeningRank: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Closing Rank *</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.ClosingRank}
                      onChange={(e) => setFormData({ ...formData, ClosingRank: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRank ? 'Update' : 'Create'} Rank Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranks;
