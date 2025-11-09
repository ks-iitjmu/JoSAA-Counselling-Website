import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import { register } from '../services/api';

type Role = 'Student' | 'Institute' | 'Administrator';

interface StudentData {
  candidateID: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  email: string;
  jeeMainsAppNumber: string;
  jeeAdvancedAppNumber: string;
  stateOfEligibility: string;
  category: string;
  pwdStatus: string;
  password: string;
  confirmPassword: string;
}

interface InstituteData {
  instituteCode: string;
  instituteName: string;
  instituteType: string;
  mailingAddress: string;
  phone: string;
  website: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [studentData, setStudentData] = useState<StudentData>({
    candidateID: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    email: '',
    jeeMainsAppNumber: '',
    jeeAdvancedAppNumber: '',
    stateOfEligibility: '',
    category: '',
    pwdStatus: 'No',
    password: '',
    confirmPassword: ''
  });

  const [instituteData, setInstituteData] = useState<InstituteData>({
    instituteCode: '',
    instituteName: '',
    instituteType: '',
    mailingAddress: '',
    phone: '',
    website: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError('');
    setSuccess('');
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleInstituteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstituteData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateStudentForm = (): boolean => {
    if (!studentData.candidateID || !studentData.name || !studentData.email) {
      setError('Please fill in all required fields');
      return false;
    }

    if (studentData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (studentData.password !== studentData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (studentData.mobileNumber && !mobileRegex.test(studentData.mobileNumber)) {
      setError('Mobile number must be 10 digits');
      return false;
    }

    return true;
  };

  const validateInstituteForm = (): boolean => {
    if (!instituteData.instituteCode || !instituteData.instituteName || !instituteData.email) {
      setError('Please fill in all required fields');
      return false;
    }

    if (instituteData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (instituteData.password !== instituteData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(instituteData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStudentForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = studentData;
      const response = await register('Student', dataToSend);

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstituteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateInstituteForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = instituteData;
      const response = await register('Institute', dataToSend);

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>JOSAA Registration</h1>
          <p>Create your account</p>
        </div>

        {!selectedRole ? (
          <div className="role-selection">
            <h2>Select Your Role</h2>
            <div className="role-cards">
              <div className="role-card" onClick={() => handleRoleSelect('Student')}>
                <div className="role-icon">🎓</div>
                <h3>Student</h3>
                <p>Register as a candidate for JEE counseling</p>
              </div>
              <div className="role-card" onClick={() => handleRoleSelect('Institute')}>
                <div className="role-icon">🏛️</div>
                <h3>Institute</h3>
                <p>Register your educational institution</p>
              </div>
            </div>
            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="role-badge">
              <span>Registering as: <strong>{selectedRole}</strong></span>
              <button 
                className="change-role-btn" 
                onClick={() => setSelectedRole('')}
                disabled={loading}
              >
                Change Role
              </button>
            </div>

            {selectedRole === 'Student' && (
              <form onSubmit={handleStudentSubmit} className="register-form">
                <h3>Student Registration Form</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="candidateID">Candidate ID <span className="required">*</span></label>
                    <input
                      type="text"
                      id="candidateID"
                      name="candidateID"
                      value={studentData.candidateID}
                      onChange={handleStudentChange}
                      placeholder="Enter Candidate ID"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={studentData.name}
                      onChange={handleStudentChange}
                      placeholder="Enter full name"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={studentData.dateOfBirth}
                      onChange={handleStudentChange}
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={studentData.gender}
                      onChange={handleStudentChange}
                      className="form-input"
                      disabled={loading}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={studentData.email}
                      onChange={handleStudentChange}
                      placeholder="student@example.com"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={studentData.mobileNumber}
                      onChange={handleStudentChange}
                      placeholder="10-digit mobile number"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="jeeMainsAppNumber">JEE Mains Application Number</label>
                    <input
                      type="text"
                      id="jeeMainsAppNumber"
                      name="jeeMainsAppNumber"
                      value={studentData.jeeMainsAppNumber}
                      onChange={handleStudentChange}
                      placeholder="JEE Mains App No"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="jeeAdvancedAppNumber">JEE Advanced Application Number</label>
                    <input
                      type="text"
                      id="jeeAdvancedAppNumber"
                      name="jeeAdvancedAppNumber"
                      value={studentData.jeeAdvancedAppNumber}
                      onChange={handleStudentChange}
                      placeholder="JEE Advanced App No"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="stateOfEligibility">State of Eligibility</label>
                    <input
                      type="text"
                      id="stateOfEligibility"
                      name="stateOfEligibility"
                      value={studentData.stateOfEligibility}
                      onChange={handleStudentChange}
                      placeholder="Enter state"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={studentData.category}
                      onChange={handleStudentChange}
                      className="form-input"
                      disabled={loading}
                    >
                      <option value="">Select Category</option>
                      <option value="OPEN">OPEN</option>
                      <option value="OBC-NCL">OBC-NCL</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pwdStatus">PwD Status</label>
                  <select
                    id="pwdStatus"
                    name="pwdStatus"
                    value={studentData.pwdStatus}
                    onChange={handleStudentChange}
                    className="form-input"
                    disabled={loading}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={studentData.password}
                      onChange={handleStudentChange}
                      placeholder="Min 6 characters"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={studentData.confirmPassword}
                      onChange={handleStudentChange}
                      placeholder="Re-enter password"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="success-message">
                    <span className="success-icon">✓</span>
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="register-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Registering...
                    </>
                  ) : (
                    'Register as Student'
                  )}
                </button>
              </form>
            )}

            {selectedRole === 'Institute' && (
              <form onSubmit={handleInstituteSubmit} className="register-form">
                <h3>Institute Registration Form</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="instituteCode">Institute Code <span className="required">*</span></label>
                    <input
                      type="text"
                      id="instituteCode"
                      name="instituteCode"
                      value={instituteData.instituteCode}
                      onChange={handleInstituteChange}
                      placeholder="e.g., IIT001"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="instituteName">Institute Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="instituteName"
                      name="instituteName"
                      value={instituteData.instituteName}
                      onChange={handleInstituteChange}
                      placeholder="Full institute name"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="instituteType">Institute Type</label>
                    <select
                      id="instituteType"
                      name="instituteType"
                      value={instituteData.instituteType}
                      onChange={handleInstituteChange}
                      className="form-input"
                      disabled={loading}
                    >
                      <option value="">Select Type</option>
                      <option value="IIT">IIT</option>
                      <option value="NIT">NIT</option>
                      <option value="IIIT">IIIT</option>
                      <option value="GFTI">GFTI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={instituteData.phone}
                      onChange={handleInstituteChange}
                      placeholder="Contact number"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="mailingAddress">Mailing Address</label>
                  <textarea
                    id="mailingAddress"
                    name="mailingAddress"
                    value={instituteData.mailingAddress}
                    onChange={handleInstituteChange}
                    placeholder="Full address"
                    className="form-input"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={instituteData.website}
                      onChange={handleInstituteChange}
                      placeholder="https://www.example.edu"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={instituteData.email}
                      onChange={handleInstituteChange}
                      placeholder="institute@example.edu"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={instituteData.password}
                      onChange={handleInstituteChange}
                      placeholder="Min 6 characters"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={instituteData.confirmPassword}
                      onChange={handleInstituteChange}
                      placeholder="Re-enter password"
                      className="form-input"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="success-message">
                    <span className="success-icon">✓</span>
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="register-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Registering...
                    </>
                  ) : (
                    'Register as Institute'
                  )}
                </button>
              </form>
            )}

            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Login here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
