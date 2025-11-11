import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI, instituteAPI } from '../services/api';
import { getCurrentUser, isAuthenticated, isStudent, isAdmin, isInstitute } from '../utils/auth';
import CandidateModal from '../components/CandidateModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
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
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    
    // If student, show only their own data
    if (isStudent() && user?.candidateID) {
      fetchStudentData(user.candidateID);
    } else if (isInstitute() && user?.instituteCode) {
      // Institute sees only candidates who applied to them
      fetchInstituteApplicants(user.instituteCode);
    } else if (isAdmin()) {
      // Admin can see all candidates
      fetchCandidates();
    } else {
      // Institutes need to use specific endpoints
      setError('Please use the appropriate dashboard to view relevant candidate information.');
      setLoading(false);
    }
  }, [navigate]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await candidateAPI.getAll();
      setCandidates(response.data.data || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch candidates. Please try again later.');
      }
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstituteApplicants = async (instituteCode: string) => {
    try {
      setLoading(true);
      const response = await instituteAPI.getApplicants(instituteCode);
      setCandidates(response.data.data || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch applicants. Please try again later.');
      }
      console.error('Error fetching institute applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async (candidateId: number) => {
    try {
      setLoading(true);
      const response = await candidateAPI.getById(candidateId);
      // For students, show only their own data
      setCandidates([response.data.data]);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch your information. Please try again later.');
      }
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const handleAddCandidate = () => {
    setSelectedCandidate(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteCandidate = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    
    try {
      await candidateAPI.delete(candidateToDelete.CandidateID);
      setCandidates(candidates.filter(c => c.CandidateID !== candidateToDelete.CandidateID));
      setSuccessMessage(`Candidate ${candidateToDelete.Name} deleted successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete candidate');
    }
  };

  const handleSaveCandidate = async (candidateData: any) => {
    try {
      if (isEditing && selectedCandidate) {
        await candidateAPI.update(selectedCandidate.CandidateID, candidateData);
        setCandidates(candidates.map(c => 
          c.CandidateID === selectedCandidate.CandidateID 
            ? { ...c, ...candidateData } 
            : c
        ));
        setSuccessMessage(`Candidate ${candidateData.Name} updated successfully`);
      } else {
        await candidateAPI.create(candidateData);
        setCandidates([...candidates, candidateData]);
        setSuccessMessage(`Candidate ${candidateData.Name} added successfully`);
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} candidate`);
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
    return <div className="loading">Loading...</div>;
  }

  const isStudentView = isStudent();

  return (
    <div className="candidates-page">
      <div className="page-header">
        <h1>{isStudentView ? 'My Profile' : 'Registered Candidates'}</h1>
        <p className="page-description">
          {isStudentView 
            ? 'View your candidate information' 
            : 'View all registered candidates for JoSAA 2025 counselling'}
        </p>
      </div>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {!isStudentView && (
        <>
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
        </>
      )}

      {/* Add Candidate Button for Admin */}
      {isAdmin() && !isStudentView && (
        <div className="add-candidate-section">
          <button className="add-candidate-btn" onClick={handleAddCandidate}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            Add New Candidate
          </button>
        </div>
      )}

      {filteredCandidates.length === 0 ? (
        <div className="no-results">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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
                <div className="candidate-header-right">
                  <span className={`category-badge ${candidate.Category}`}>
                    {candidate.Category}
                  </span>
                  {isAdmin() && (
                    <div className="candidate-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditCandidate(candidate)}
                        title="Edit candidate"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
                        </svg>
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteCandidate(candidate)}
                        title="Delete candidate"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Modals */}
      <CandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCandidate}
        candidate={selectedCandidate}
        isEditing={isEditing}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteCandidate}
        title="Delete Candidate"
        message={`Are you sure you want to delete ${candidateToDelete?.Name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Candidates;
