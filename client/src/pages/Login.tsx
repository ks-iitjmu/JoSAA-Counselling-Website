import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login } from '../services/api';

interface LoginForm {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.identifier || !formData.password) {
        setError('Please enter both identifier and password');
        setLoading(false);
        return;
      }

      // Call login API
      const response = await login(formData.identifier, formData.password);

      if (response.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');

        // Navigate based on role
        const role = response.data.user.role;
        switch (role) {
          case 'Student':
            navigate('/student-dashboard');
            break;
          case 'Institute':
            navigate('/institute-dashboard');
            break;
          case 'Administrator':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>JOSAA Login</h1>
          <p>Joint Seat Allocation Authority</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">
              Username / Email / Candidate ID / Institute Code
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your identifier"
              className="form-input"
              disabled={loading}
              autoComplete="username"
            />
            <small className="form-help">
              Students can use Candidate ID, Email, or Mobile Number.
              Institutes can use Institute Code.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-input"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="register-link">
                Register here
              </Link>
            </p>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>
        </form>

        <div className="login-info">
          <h3>Login Information</h3>
          <ul>
            <li><strong>Students:</strong> Use your Candidate ID, registered email, or mobile number</li>
            <li><strong>Institutes:</strong> Use your Institute Code</li>
            <li><strong>Administrators:</strong> Use your admin username</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
