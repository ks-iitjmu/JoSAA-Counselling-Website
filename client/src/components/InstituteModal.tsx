import React, { useState, useEffect } from 'react';
import './InstituteModal.css';

interface InstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instituteData: any) => void;
  institute?: any;
  isEditing?: boolean;
}

const InstituteModal: React.FC<InstituteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  institute,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    InstituteCode: '',
    InstituteName: '',
    InstituteType: 'IIT',
    MailingAddress: '',
    Phone: '',
    Website: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (institute && isEditing) {
      setFormData({
        InstituteCode: institute.InstituteCode || '',
        InstituteName: institute.InstituteName || '',
        InstituteType: institute.InstituteType || 'IIT',
        MailingAddress: institute.MailingAddress || '',
        Phone: institute.Phone || '',
        Website: institute.Website || ''
      });
    } else {
      // Reset form for new institute
      setFormData({
        InstituteCode: '',
        InstituteName: '',
        InstituteType: 'IIT',
        MailingAddress: '',
        Phone: '',
        Website: ''
      });
    }
    setErrors({});
  }, [institute, isEditing, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required fields validation
    if (!formData.InstituteCode.trim()) {
      newErrors.InstituteCode = 'Institute Code is required';
    } else if (!/^[A-Z0-9_]{2,20}$/.test(formData.InstituteCode)) {
      newErrors.InstituteCode = 'Institute Code must be 2-20 characters, uppercase letters, numbers, and underscores only';
    }

    if (!formData.InstituteName.trim()) {
      newErrors.InstituteName = 'Institute Name is required';
    } else if (formData.InstituteName.length > 255) {
      newErrors.InstituteName = 'Institute Name must be less than 255 characters';
    }

    if (!formData.InstituteType.trim()) {
      newErrors.InstituteType = 'Institute Type is required';
    }

    if (!formData.MailingAddress.trim()) {
      newErrors.MailingAddress = 'Mailing Address is required';
    }

    // Phone validation
    if (formData.Phone && !/^\+?[\d\s\-\(\)]{10,20}$/.test(formData.Phone)) {
      newErrors.Phone = 'Please enter a valid phone number';
    }

    // Website validation
    if (formData.Website && !/^https?:\/\/.+\..+/.test(formData.Website)) {
      newErrors.Website = 'Please enter a valid website URL (http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up the data before sending
      const cleanedData = {
        ...formData,
        Phone: formData.Phone || null,
        Website: formData.Website || null
      };
      
      onSave(cleanedData);
    }
  };

  const handleClose = () => {
    setFormData({
      InstituteCode: '',
      InstituteName: '',
      InstituteType: 'IIT',
      MailingAddress: '',
      Phone: '',
      Website: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const instituteTypes = [
    'IIT',
    'NIT',
    'IIIT',
    'GFTI',
    'Other'
  ];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content institute-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Institute' : 'Add New Institute'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Institute Code */}
            <div className="form-group">
              <label htmlFor="InstituteCode">
                Institute Code <span className="required">*</span>
              </label>
              <input
                type="text"
                id="InstituteCode"
                name="InstituteCode"
                value={formData.InstituteCode}
                onChange={handleInputChange}
                className={errors.InstituteCode ? 'error' : ''}
                placeholder="e.g., IIT_D, NIT_K"
                disabled={isEditing} // Can't change primary key
                style={{ textTransform: 'uppercase' }}
              />
              {errors.InstituteCode && <span className="error-text">{errors.InstituteCode}</span>}
            </div>

            {/* Institute Name */}
            <div className="form-group">
              <label htmlFor="InstituteName">
                Institute Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="InstituteName"
                name="InstituteName"
                value={formData.InstituteName}
                onChange={handleInputChange}
                className={errors.InstituteName ? 'error' : ''}
                placeholder="e.g., Indian Institute of Technology Delhi"
              />
              {errors.InstituteName && <span className="error-text">{errors.InstituteName}</span>}
            </div>

            {/* Institute Type */}
            <div className="form-group">
              <label htmlFor="InstituteType">
                Institute Type <span className="required">*</span>
              </label>
              <select
                id="InstituteType"
                name="InstituteType"
                value={formData.InstituteType}
                onChange={handleInputChange}
                className={errors.InstituteType ? 'error' : ''}
              >
                {instituteTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.InstituteType && <span className="error-text">{errors.InstituteType}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="Phone">Phone</label>
              <input
                type="tel"
                id="Phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleInputChange}
                className={errors.Phone ? 'error' : ''}
                placeholder="e.g., +91-11-26591999"
              />
              {errors.Phone && <span className="error-text">{errors.Phone}</span>}
            </div>

            {/* Website */}
            <div className="form-group full-width">
              <label htmlFor="Website">Website</label>
              <input
                type="url"
                id="Website"
                name="Website"
                value={formData.Website}
                onChange={handleInputChange}
                className={errors.Website ? 'error' : ''}
                placeholder="e.g., https://www.iitd.ac.in"
              />
              {errors.Website && <span className="error-text">{errors.Website}</span>}
            </div>

            {/* Mailing Address */}
            <div className="form-group full-width">
              <label htmlFor="MailingAddress">
                Mailing Address <span className="required">*</span>
              </label>
              <textarea
                id="MailingAddress"
                name="MailingAddress"
                value={formData.MailingAddress}
                onChange={handleInputChange}
                className={errors.MailingAddress ? 'error' : ''}
                placeholder="Complete postal address"
                rows={3}
              />
              {errors.MailingAddress && <span className="error-text">{errors.MailingAddress}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Institute' : 'Add Institute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstituteModal;