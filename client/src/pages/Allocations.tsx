import { useState, useEffect } from 'react';
import { allocationAPI } from '../services/api';
import './Allocations.css';

interface Allocation {
  AllocationID: number;
  CandidateID: number;
  RoundID: number;
  AllocatedInstituteCode: string;
  AllocatedProgramCode: string;
  Action: string;
  CandidateName?: string;
  InstituteName?: string;
  ProgramName?: string;
}

const Allocations = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRound, setFilterRound] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const response = await allocationAPI.getAll();
      // API returns { success: true, data: [...] }
      setAllocations(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch allocations. Please try again later.');
      console.error('Error fetching allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = 
      allocation.CandidateID.toString().includes(searchTerm) ||
      (allocation.CandidateName && allocation.CandidateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (allocation.InstituteName && allocation.InstituteName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || allocation.Action === filterStatus;
    const matchesRound = filterRound === 'All' || allocation.RoundID.toString() === filterRound;
    
    return matchesSearch && matchesStatus && matchesRound;
  });

  const statuses = ['All', ...Array.from(new Set(allocations.map(a => a.Action)))];
  const rounds = ['All', ...Array.from(new Set(allocations.map(a => a.RoundID.toString())))];

  if (loading) {
    return <div className="loading">Loading allocations...</div>;
  }

  return (
    <div className="allocations-page">
      <div className="page-header">
        <h1>Seat Allocations</h1>
        <p className="page-description">
          View seat allocation results for all counselling rounds
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-overview">
        <div className="stat-box">
          <div className="stat-value">{allocations.length}</div>
          <div className="stat-label">Total Allocations</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {allocations.filter(a => a.Action === 'Allocated').length}
          </div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {allocations.filter(a => a.Action === 'Pending').length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {allocations.filter(a => a.Action === 'Not Allocated').length}
          </div>
          <div className="stat-label">Not Allocated</div>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by candidate ID, name, or institute..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
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

      <div className="allocations-count">
        Showing {filteredAllocations.length} of {allocations.length} allocations
      </div>

      {filteredAllocations.length === 0 ? (
        <div className="no-results">
          <div className="empty-state-icon">🎯</div>
          <p className="empty-state-text">No allocations found</p>
          <p className="empty-state-subtext">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="allocations-list">
          {filteredAllocations.map(allocation => (
            <div key={allocation.AllocationID} className="allocation-card">
              <div className="allocation-header">
                <div className="round-badge">
                  Round {allocation.RoundID}
                </div>
                <span className={`status-badge ${allocation.Action.toLowerCase().replace(' ', '-')}`}>
                  {allocation.Action}
                </span>
              </div>

              <div className="allocation-body">
                <div className="allocation-info">
                  <div className="info-item">
                    <span className="info-icon">🆔</span>
                    <div className="info-content">
                      <span className="info-label">Allocation ID</span>
                      <span className="info-value">{allocation.AllocationID}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <span className="info-label">Candidate</span>
                      <span className="info-value">
                        {allocation.CandidateName || `ID: ${allocation.CandidateID}`}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">🏛️</span>
                    <div className="info-content">
                      <span className="info-label">Institute</span>
                      <span className="info-value">
                        {allocation.InstituteName || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">📚</span>
                    <div className="info-content">
                      <span className="info-label">Program</span>
                      <span className="info-value">
                        {allocation.ProgramName || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allocations;
