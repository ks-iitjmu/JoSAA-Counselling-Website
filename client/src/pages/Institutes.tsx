import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instituteAPI } from '../services/api';
import { isAuthenticated, isAdmin } from '../utils/auth';
import InstituteModal from '../components/InstituteModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import './Institutes.css';

interface Institute {
  InstituteCode: string;
  InstituteName: string;
  InstituteType: string;
  MailingAddress: string;
  Phone: string;
  Website: string;
}

const Institutes = () => {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [instituteToDelete, setInstituteToDelete] = useState<Institute | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check authentication for admin operations
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchInstitutes();
  }, [navigate]);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const response = await instituteAPI.getAll();
      setInstitutes(response.data.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch institutes. Please try again later.');
      }
      console.error('Error fetching institutes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const handleAddInstitute = () => {
    setSelectedInstitute(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditInstitute = (institute: Institute) => {
    setSelectedInstitute(institute);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteInstitute = (institute: Institute) => {
    setInstituteToDelete(institute);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteInstitute = async () => {
    if (!instituteToDelete) return;
    
    try {
      await instituteAPI.delete(instituteToDelete.InstituteCode);
      setInstitutes(institutes.filter(i => i.InstituteCode !== instituteToDelete.InstituteCode));
      setSuccessMessage(`Institute ${instituteToDelete.InstituteName} deleted successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete institute');
    }
    setIsConfirmDialogOpen(false);
    setInstituteToDelete(null);
  };

  const handleSaveInstitute = async (instituteData: any) => {
    try {
      if (isEditing && selectedInstitute) {
        await instituteAPI.update(selectedInstitute.InstituteCode, instituteData);
        setInstitutes(institutes.map(i => 
          i.InstituteCode === selectedInstitute.InstituteCode 
            ? { ...i, ...instituteData } 
            : i
        ));
        setSuccessMessage(`Institute ${instituteData.InstituteName} updated successfully`);
      } else {
        await instituteAPI.create(instituteData);
        // Fetch fresh data to get the complete institute record
        const response = await instituteAPI.getByCode(instituteData.InstituteCode);
        setInstitutes([...institutes, response.data.data]);
        setSuccessMessage(`Institute ${instituteData.InstituteName} added successfully`);
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} institute`);
    }
  };

  const filteredInstitutes = institutes.filter(inst => {
    const matchesSearch = inst.InstituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.InstituteCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || inst.InstituteType === filterType;
    return matchesSearch && matchesType;
  });

  const instituteTypes = ['All', ...Array.from(new Set(institutes.map(i => i.InstituteType)))];

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }

  return (
    <div className="institutes-page">
      <div className="page-header">
        <h1>Participating Institutes</h1>
        <p className="page-description">
          View all participating institutes for JoSAA 2025 counselling
        </p>
      </div>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search institutes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          {instituteTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="institutes-count">
        Showing {filteredInstitutes.length} of {institutes.length} institutes
      </div>

      {/* Add Institute Button for Admin */}
      {isAdmin() && (
        <div className="add-institute-section">
          <button className="add-institute-btn" onClick={handleAddInstitute}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            Add New Institute
          </button>
        </div>
      )}

      <div className="institutes-grid">
        {filteredInstitutes.map(institute => (
          <div key={institute.InstituteCode} className="institute-card">
            <div className="institute-header">
              <div className="institute-info">
                <h3>{institute.InstituteName}</h3>
                <span className="institute-code">Code: {institute.InstituteCode}</span>
              </div>
              <div className="institute-header-right">
                <span className={`institute-type-badge ${institute.InstituteType}`}>
                  {institute.InstituteType}
                </span>
                {isAdmin() && (
                  <div className="institute-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditInstitute(institute)}
                      title="Edit institute"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteInstitute(institute)}
                      title="Delete institute"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="institute-details">
              <div className="detail-row">
                <span className="detail-label">📍 Address:</span>
                <span className="detail-value">{institute.MailingAddress}</span>
              </div>
              {institute.Phone && (
                <div className="detail-row">
                  <span className="detail-label">📞 Phone:</span>
                  <span className="detail-value">{institute.Phone}</span>
                </div>
              )}
              {institute.Website && (
                <div className="detail-row">
                  <span className="detail-label">🌐 Website:</span>
                  <span className="detail-value">
                    <a href={institute.Website} target="_blank" rel="noopener noreferrer">
                      {institute.Website}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredInstitutes.length === 0 && (
        <div className="no-results">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 9L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 13L14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="empty-state-text">No institutes found</p>
          <p className="empty-state-subtext">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modals */}
      <InstituteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInstitute}
        institute={selectedInstitute}
        isEditing={isEditing}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteInstitute}
        title="Delete Institute"
        message={`Are you sure you want to delete ${instituteToDelete?.InstituteName}? This action cannot be undone and may affect related data.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Institutes;
