import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, isStudent, isInstitute } from '../utils/auth';
import api from '../services/api';
import './Profile.css';

interface ProfileData {
  userID: number;
  username: string;
  email: string;
  role: string;
  // Student fields
  candidateID?: number;
  studentName?: string;
  studentEmail?: string;
  mobileNumber?: string;
  jeeMainsAIR?: number;
  // Institute fields
  instituteCode?: string;
  instituteName?: string;
  instituteEmail?: string;
  institutePhone?: string;
  website?: string;
  location?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated() || !user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching profile for user:', user);
      console.log('User type checks - isStudent:', isStudent(), 'isInstitute:', isInstitute(), 'userID:', user?.userID);
      
      if (isStudent() && user?.candidateID) {
        const response = await api.get(`/candidates/${user.candidateID}`);
        console.log('Student response:', response.data);
        setProfileData({
          userID: user.userID,
          username: user.username,
          email: user.email,
          role: user.role,
          ...response.data
        });
        setFormData({
          Name: response.data.Name,
          Email: response.data.Email,
          MobileNumber: response.data.MobileNumber
        });
      } else if (isInstitute() && user?.instituteCode) {
        const response = await api.get(`/institutes/${user.instituteCode}`);
        console.log('Institute response:', response.data);
        setProfileData({
          userID: user.userID,
          username: user.username,
          email: user.email,
          role: user.role,
          ...response.data
        });
        setFormData({
          InstituteName: response.data.InstituteName,
          Email: response.data.Email,
          PhoneNumber: response.data.PhoneNumber,
          Website: response.data.Website,
          Location: response.data.Location
        });
      } else if (user?.userID) {
        // Admin - fetch profile from auth API
        console.log('Fetching admin profile for userID:', user.userID);
        const response = await api.get(`/auth/profile/${user.userID}`);
        console.log('Admin API response:', response.data);
        const userData = response.data.data?.user || response.data.user || response.data;
        console.log('Extracted user data:', userData);
        
        if (!userData) {
          throw new Error('No user data returned from API');
        }
        
        setProfileData({
          userID: userData.userID || userData.UserID || user.userID,
          username: userData.username || userData.Username || user.username,
          email: userData.email || userData.Email || user.email,
          role: userData.role || userData.Role || user.role
        });
        setFormData({
          Username: userData.username || userData.Username || user.username,
          Email: userData.email || userData.Email || user.email
        });
      } else {
        console.log('No valid user type or missing required fields');
        throw new Error('Invalid user type or missing required user information');
      }
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (isStudent() && user?.candidateID) {
        await api.put(`/candidates/${user.candidateID}`, formData);
        setSuccess('Profile updated successfully!');
      } else if (isInstitute() && user?.instituteCode) {
        await api.put(`/institutes/${user.instituteCode}`, formData);
        setSuccess('Profile updated successfully!');
      } else if (user?.userID) {
        // Admin profile update
        await api.put(`/auth/profile/${user.userID}`, formData);
        setSuccess('Profile updated successfully!');
      }
      
      setIsEditing(false);
      fetchProfile();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await api.put(`/auth/password/${user?.userID}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <h2>Error Loading Profile</h2>
            <p>{error}</p>
            <button onClick={fetchProfile} className="btn-retry">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <h2>Profile Not Found</h2>
            <p>Unable to load profile data.</p>
            <button onClick={fetchProfile} className="btn-retry">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (isStudent() && profileData.studentName) {
      return profileData.studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (isInstitute() && profileData.instituteName) {
      return profileData.instituteName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return profileData.username.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (isStudent()) return profileData.studentName || profileData.username;
    if (isInstitute()) return profileData.instituteName || profileData.username;
    return profileData.username;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {getInitials()}
          </div>
          <div className="profile-header-info">
            <h1>{getDisplayName()}</h1>
            <div className="profile-role-badge" style={{
              backgroundColor: profileData.role === 'Student' ? 'var(--primary-green)' :
                             profileData.role === 'Institute' ? 'var(--primary-orange)' :
                             'var(--primary-purple)'
            }}>
              {profileData.role}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Profile Content */}
        <div className="profile-content">
          {/* Account Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Account Information</h2>
              {!isEditing && (
                <button 
                  className="btn-edit" 
                  onClick={() => setIsEditing(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                {isStudent() && (
                  <>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="Name"
                        value={formData.Name || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input
                        type="tel"
                        name="MobileNumber"
                        value={formData.MobileNumber || ''}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </>
                )}

                {isInstitute() && (
                  <>
                    <div className="form-group">
                      <label>Institute Name</label>
                      <input
                        type="text"
                        name="InstituteName"
                        value={formData.InstituteName || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="PhoneNumber"
                        value={formData.PhoneNumber || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input
                        type="url"
                        name="Website"
                        value={formData.Website || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="Location"
                        value={formData.Location || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {!isStudent() && !isInstitute() && (
                  <>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        name="Username"
                        value={formData.Username || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-save">Save Changes</button>
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-grid">
                {isStudent() && (
                  <>
                    <div className="info-item">
                      <span className="info-label">Candidate ID</span>
                      <span className="info-value">{profileData.candidateID}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{profileData.studentName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profileData.studentEmail || profileData.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Mobile Number</span>
                      <span className="info-value">{profileData.mobileNumber || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">JEE Mains AIR</span>
                      <span className="info-value">{profileData.jeeMainsAIR || 'N/A'}</span>
                    </div>
                  </>
                )}

                {isInstitute() && (
                  <>
                    <div className="info-item">
                      <span className="info-label">Institute Code</span>
                      <span className="info-value">{profileData.instituteCode}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Institute Name</span>
                      <span className="info-value">{profileData.instituteName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profileData.instituteEmail || profileData.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone Number</span>
                      <span className="info-value">{profileData.institutePhone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Website</span>
                      <span className="info-value">
                        {profileData.website ? (
                          <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                            {profileData.website}
                          </a>
                        ) : 'Not provided'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Location</span>
                      <span className="info-value">{profileData.location || 'Not provided'}</span>
                    </div>
                  </>
                )}

                {!isStudent() && !isInstitute() && (
                  <>
                    <div className="info-item">
                      <span className="info-label">Username</span>
                      <span className="info-value">{profileData.username}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profileData.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">User ID</span>
                      <span className="info-value">{profileData.userID}</span>
                    </div>
                  </>
                )}

                <div className="info-item">
                  <span className="info-label">Account Username</span>
                  <span className="info-value">{profileData.username}</span>
                </div>
              </div>
            )}
          </div>

          {/* Security Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Security</h2>
            </div>
            
            <div className="security-info">
              <p className="security-note">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Click "Change Password" to update your account password.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form">
              {passwordError && <div className="error-message">{passwordError}</div>}
              {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
              
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Enter new password (min 6 characters)"
                />
                <small>Password must be at least 6 characters long</small>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
