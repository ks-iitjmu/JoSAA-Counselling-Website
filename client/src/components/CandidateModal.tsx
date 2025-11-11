import React, { useState, useEffect } from 'react';
import './CandidateModal.css';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidateData: any) => void;
  candidate?: any;
  isEditing?: boolean;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  candidate,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    CandidateID: '',
    Name: '',
    EmailAddress: '',
    MobileNumber: '',
    DateOfBirth: '',
    Gender: 'Male',
    Category: 'General',
    JEE_Mains_AIR: '',
    JEE_Advanced_Qualifying_status: 'Not Qualified',
    JEE_Mains_Application_Number: '',
    JEE_Advanced_Application_Number: '',
    StateOfEligibility: '',
    JEE_Mains_Category_Rank: '',
    PwD_status: 'No',
    PwD_Category: '',
    DS_Status: 'No',
    Twelfth_Aggregate_Percentage: '',
    Twelfth_Top_20_Percentile_Status: 'No',
    Document_Upload_Status: 'Pending'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (candidate && isEditing) {
      setFormData({
        CandidateID: candidate.CandidateID || '',
        Name: candidate.Name || '',
        EmailAddress: candidate.EmailAddress || '',
        MobileNumber: candidate.MobileNumber || '',
        DateOfBirth: candidate.DateOfBirth ? candidate.DateOfBirth.split('T')[0] : '',
        Gender: candidate.Gender || 'Male',
        Category: candidate.Category || 'General',
        JEE_Mains_AIR: candidate.JEE_Mains_AIR || '',
        JEE_Advanced_Qualifying_status: candidate.JEE_Advanced_Qualifying_status || 'Not Qualified',
        JEE_Mains_Application_Number: candidate.JEE_Mains_Application_Number || '',
        JEE_Advanced_Application_Number: candidate.JEE_Advanced_Application_Number || '',
        StateOfEligibility: candidate.StateOfEligibility || '',
        JEE_Mains_Category_Rank: candidate.JEE_Mains_Category_Rank || '',
        PwD_status: candidate.PwD_status || 'No',
        PwD_Category: candidate.PwD_Category || '',
        DS_Status: candidate.DS_Status || 'No',
        Twelfth_Aggregate_Percentage: candidate.Twelfth_Aggregate_Percentage || '',
        Twelfth_Top_20_Percentile_Status: candidate.Twelfth_Top_20_Percentile_Status || 'No',
        Document_Upload_Status: candidate.Document_Upload_Status || 'Pending'
      });
    } else {
      // Reset form for new candidate
      setFormData({
        CandidateID: '',
        Name: '',
        EmailAddress: '',
        MobileNumber: '',
        DateOfBirth: '',
        Gender: 'Male',
        Category: 'General',
        JEE_Mains_AIR: '',
        JEE_Advanced_Qualifying_status: 'Not Qualified',
        JEE_Mains_Application_Number: '',
        JEE_Advanced_Application_Number: '',
        StateOfEligibility: '',
        JEE_Mains_Category_Rank: '',
        PwD_status: 'No',
        PwD_Category: '',
        DS_Status: 'No',
        Twelfth_Aggregate_Percentage: '',
        Twelfth_Top_20_Percentile_Status: 'No',
        Document_Upload_Status: 'Pending'
      });
    }
    setErrors({});
  }, [candidate, isEditing, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.CandidateID.trim()) {
      newErrors.CandidateID = 'Candidate ID is required';
    }

    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.EmailAddress.trim()) {
      newErrors.EmailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.EmailAddress)) {
      newErrors.EmailAddress = 'Email is invalid';
    }

    if (!formData.MobileNumber.trim()) {
      newErrors.MobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.MobileNumber)) {
      newErrors.MobileNumber = 'Mobile number must be 10 digits';
    }

    if (!formData.DateOfBirth) {
      newErrors.DateOfBirth = 'Date of birth is required';
    }

    if (formData.JEE_Mains_AIR && !/^\d+$/.test(formData.JEE_Mains_AIR)) {
      newErrors.JEE_Mains_AIR = 'JEE Mains AIR must be a number';
    }

    if (formData.JEE_Mains_Category_Rank && !/^\d+$/.test(formData.JEE_Mains_Category_Rank)) {
      newErrors.JEE_Mains_Category_Rank = 'JEE Mains Category Rank must be a number';
    }

    if (formData.Twelfth_Aggregate_Percentage && (!/^\d+(\.\d+)?$/.test(formData.Twelfth_Aggregate_Percentage) || parseFloat(formData.Twelfth_Aggregate_Percentage) > 100)) {
      newErrors.Twelfth_Aggregate_Percentage = 'Percentage must be a valid number between 0-100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Clear PwD_Category if PwD_status is set to 'No'
      if (name === 'PwD_status' && value === 'No') {
        newData.PwD_Category = '';
      }
      
      return newData;
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      CandidateID: parseInt(formData.CandidateID),
      Name: formData.Name || null,
      EmailAddress: formData.EmailAddress || null,
      MobileNumber: formData.MobileNumber || null,
      DateOfBirth: formData.DateOfBirth || null,
      Gender: formData.Gender || null,
      Category: formData.Category || null,
      JEE_Mains_AIR: formData.JEE_Mains_AIR && formData.JEE_Mains_AIR.trim() !== '' ? parseInt(formData.JEE_Mains_AIR) : null,
      JEE_Advanced_Qualifying_status: formData.JEE_Advanced_Qualifying_status || null,
      JEE_Mains_Application_Number: formData.JEE_Mains_Application_Number && formData.JEE_Mains_Application_Number.trim() !== '' ? formData.JEE_Mains_Application_Number : null,
      JEE_Advanced_Application_Number: formData.JEE_Advanced_Application_Number && formData.JEE_Advanced_Application_Number.trim() !== '' ? formData.JEE_Advanced_Application_Number : null,
      StateOfEligibility: formData.StateOfEligibility && formData.StateOfEligibility.trim() !== '' ? formData.StateOfEligibility : null,
      JEE_Mains_Category_Rank: formData.JEE_Mains_Category_Rank && formData.JEE_Mains_Category_Rank.trim() !== '' ? parseInt(formData.JEE_Mains_Category_Rank) : null,
      PwD_status: formData.PwD_status || 'No',
      PwD_Category: formData.PwD_Category && formData.PwD_Category.trim() !== '' ? formData.PwD_Category : null,
      DS_Status: formData.DS_Status || 'No',
      Twelfth_Aggregate_Percentage: formData.Twelfth_Aggregate_Percentage && formData.Twelfth_Aggregate_Percentage.trim() !== '' ? parseFloat(formData.Twelfth_Aggregate_Percentage) : null,
      Twelfth_Top_20_Percentile_Status: formData.Twelfth_Top_20_Percentile_Status || 'No',
      Document_Upload_Status: formData.Document_Upload_Status || 'Pending'
    };

    onSave(dataToSubmit);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="candidate-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="CandidateID">Candidate ID *</label>
                <input
                  type="number"
                  id="CandidateID"
                  name="CandidateID"
                  value={formData.CandidateID}
                  onChange={handleChange}
                  disabled={isEditing}
                  className={errors.CandidateID ? 'error' : ''}
                />
                {errors.CandidateID && <span className="error-text">{errors.CandidateID}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="Name">Full Name *</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className={errors.Name ? 'error' : ''}
                />
                {errors.Name && <span className="error-text">{errors.Name}</span>}
              </div>
            </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="EmailAddress">Email Address *</label>
              <input
                type="email"
                id="EmailAddress"
                name="EmailAddress"
                value={formData.EmailAddress}
                onChange={handleChange}
                className={errors.EmailAddress ? 'error' : ''}
              />
              {errors.EmailAddress && <span className="error-text">{errors.EmailAddress}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="MobileNumber">Mobile Number *</label>
              <input
                type="tel"
                id="MobileNumber"
                name="MobileNumber"
                value={formData.MobileNumber}
                onChange={handleChange}
                className={errors.MobileNumber ? 'error' : ''}
              />
              {errors.MobileNumber && <span className="error-text">{errors.MobileNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="DateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="DateOfBirth"
                name="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleChange}
                className={errors.DateOfBirth ? 'error' : ''}
              />
              {errors.DateOfBirth && <span className="error-text">{errors.DateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="Gender">Gender</label>
              <select
                id="Gender"
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Category">Category</label>
                <select
                  id="Category"
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="StateOfEligibility">State of Eligibility</label>
                <input
                  type="text"
                  id="StateOfEligibility"
                  name="StateOfEligibility"
                  value={formData.StateOfEligibility}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">JEE Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="JEE_Mains_AIR">JEE Mains AIR</label>
                <input
                  type="number"
                  id="JEE_Mains_AIR"
                  name="JEE_Mains_AIR"
                  value={formData.JEE_Mains_AIR}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={errors.JEE_Mains_AIR ? 'error' : ''}
                />
                {errors.JEE_Mains_AIR && <span className="error-text">{errors.JEE_Mains_AIR}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="JEE_Mains_Category_Rank">JEE Mains Category Rank</label>
                <input
                  type="number"
                  id="JEE_Mains_Category_Rank"
                  name="JEE_Mains_Category_Rank"
                  value={formData.JEE_Mains_Category_Rank}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={errors.JEE_Mains_Category_Rank ? 'error' : ''}
                />
                {errors.JEE_Mains_Category_Rank && <span className="error-text">{errors.JEE_Mains_Category_Rank}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="JEE_Advanced_Qualifying_status">JEE Advanced Status</label>
                <select
                  id="JEE_Advanced_Qualifying_status"
                  name="JEE_Advanced_Qualifying_status"
                  value={formData.JEE_Advanced_Qualifying_status}
                  onChange={handleChange}
                >
                  <option value="Not Qualified">Not Qualified</option>
                  <option value="Qualified">Qualified</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="JEE_Mains_Application_Number">JEE Mains Application Number</label>
                <input
                  type="text"
                  id="JEE_Mains_Application_Number"
                  name="JEE_Mains_Application_Number"
                  value={formData.JEE_Mains_Application_Number}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label htmlFor="JEE_Advanced_Application_Number">JEE Advanced Application Number</label>
                <input
                  type="text"
                  id="JEE_Advanced_Application_Number"
                  name="JEE_Advanced_Application_Number"
                  value={formData.JEE_Advanced_Application_Number}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Academic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Twelfth_Aggregate_Percentage">12th Aggregate Percentage</label>
                <input
                  type="number"
                  id="Twelfth_Aggregate_Percentage"
                  name="Twelfth_Aggregate_Percentage"
                  value={formData.Twelfth_Aggregate_Percentage}
                  onChange={handleChange}
                  placeholder="Optional (0-100)"
                  min="0"
                  max="100"
                  step="0.01"
                  className={errors.Twelfth_Aggregate_Percentage ? 'error' : ''}
                />
                {errors.Twelfth_Aggregate_Percentage && <span className="error-text">{errors.Twelfth_Aggregate_Percentage}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="Twelfth_Top_20_Percentile_Status">12th Top 20 Percentile Status</label>
                <select
                  id="Twelfth_Top_20_Percentile_Status"
                  name="Twelfth_Top_20_Percentile_Status"
                  value={formData.Twelfth_Top_20_Percentile_Status}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Special Categories & Status</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="PwD_status">PwD Status</label>
                <select
                  id="PwD_status"
                  name="PwD_status"
                  value={formData.PwD_status}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="PwD_Category">PwD Category</label>
                <input
                  type="text"
                  id="PwD_Category"
                  name="PwD_Category"
                  value={formData.PwD_Category}
                  onChange={handleChange}
                  placeholder="Optional (if PwD status is Yes)"
                  disabled={formData.PwD_status === 'No'}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="DS_Status">DS Status</label>
                <select
                  id="DS_Status"
                  name="DS_Status"
                  value={formData.DS_Status}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="Document_Upload_Status">Document Upload Status</label>
                <select
                  id="Document_Upload_Status"
                  name="Document_Upload_Status"
                  value={formData.Document_Upload_Status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Uploaded">Uploaded</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Candidate' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateModal;