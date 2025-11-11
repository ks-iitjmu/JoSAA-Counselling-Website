import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allocationAPI, instituteAPI } from '../services/api';
import { getCurrentUser, isAuthenticated, isStudent, isAdmin, isInstitute } from '../utils/auth';
import './Allocations.css';

interface Allocation {
  AllocationID: number;
  CandidateID: number;
  StudentName?: string;
  EmailAddress?: string;
  MobileNumber?: string;
  Category?: string;
  JEE_Mains_AIR?: number;
  RoundID: number;
  AllocatedInstituteCode?: string;
  InstituteCode?: string;
  InstituteName?: string;
  AllocatedProgramCode?: string;
  ProgramCode?: string;
  ProgramName?: string;
  Action?: string;
  AllocatedCategory?: string;
  AllocationDate?: string;
  FeePayment_status?: boolean;
  Document_Verification_Status?: string;
  CandidateName?: string;
}

const Allocations = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRound, setFilterRound] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    
    // If student, show only their allocations
    if (isStudent() && user?.candidateID) {
      fetchStudentAllocations(user.candidateID);
    } else if (isInstitute() && user?.instituteCode) {
      // Institute sees only their allocated students
      fetchInstituteAllocations(user.instituteCode);
    } else if (isAdmin()) {
      // Admin can see all allocations
      fetchAllocations();
    } else {
      setError('Please use the appropriate dashboard to view allocation information.');
      setLoading(false);
    }
  }, [navigate]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const response = await allocationAPI.getAll();
      setAllocations(response.data.data || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch allocations. Please try again later.');
      }
      console.error('Error fetching allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstituteAllocations = async (instituteCode: string) => {
    try {
      setLoading(true);
      const response = await instituteAPI.getAllocatedStudents(instituteCode);
      setAllocations(response.data.data || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch allocated students. Please try again later.');
      }
      console.error('Error fetching institute allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAllocations = async (candidateId: number) => {
    try {
      setLoading(true);
      const response = await allocationAPI.getByCandidate(candidateId);
      setAllocations(response.data.data || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch your allocations. Please try again later.');
      }
      console.error('Error fetching student allocations:', err);
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
  const isStudentView = isStudent();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="allocations-page">
      <div className="page-header">
        <h1>{isStudentView ? 'My Allocations' : 'Seat Allocations'}</h1>
        <p className="page-description">
          {isStudentView 
            ? 'View your seat allocation status for all counselling rounds' 
            : 'View seat allocation results for all counselling rounds'}
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
                <span className={`status-badge ${allocation.Action ? allocation.Action.toLowerCase().replace(' ', '-') : 'allocated'}`}>
                  {allocation.Action || 'Allocated'}
                </span>
              </div>

              <div className="allocation-body">
                <div className="allocation-info">
                  <div className="info-item">
                    <span className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 3V21M15 3V21M3 9H21M3 15H21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </span>
                    <div className="info-content">
                      <span className="info-label">Allocation ID</span>
                      <span className="info-value">{allocation.AllocationID}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div className="info-content">
                      <span className="info-label">Candidate</span>
                      <span className="info-value">
                        {allocation.CandidateName || `ID: ${allocation.CandidateID}`}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div className="info-content">
                      <span className="info-label">Institute</span>
                      <span className="info-value">
                        {allocation.InstituteName || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
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
