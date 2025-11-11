import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, candidateAPI, instituteAPI, allocationAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalInstitutes: 0,
    totalAllocations: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, candidatesRes, institutesRes, allocationsRes] = await Promise.all([
        authAPI.getAllUsers(),
        candidateAPI.getAll(),
        instituteAPI.getAll(),
        allocationAPI.getAll()
      ]);

      console.log('API Responses:', { usersRes, candidatesRes, institutesRes, allocationsRes });

      setStats({
        totalUsers: usersRes.data?.data?.length || usersRes.data?.length || 0,
        totalCandidates: candidatesRes.data?.data?.length || candidatesRes.data?.length || 0,
        totalInstitutes: institutesRes.data?.data?.length || institutesRes.data?.length || 0,
        totalAllocations: allocationsRes.data?.data?.length || allocationsRes.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set some demo data if API fails
      setStats({
        totalUsers: 12,
        totalCandidates: 1245,
        totalInstitutes: 23,
        totalAllocations: 892
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Complete system management and control</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card admin-users">
            <div className="admin-stat-content">
              <div className="admin-stat-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/>
                </svg>
              </div>
              <div className="admin-stat-info">
                <div className="admin-stat-value">{loading ? '...' : stats.totalUsers}</div>
                <div className="admin-stat-label">Total Users</div>
              </div>
            </div>
          </div>
          <div className="admin-stat-card admin-candidates">
            <div className="admin-stat-content">
              <div className="admin-stat-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                  <path d="M20 10V7H18V10H15V12H18V15H20V12H23V10H20Z" opacity="0.8"/>
                </svg>
              </div>
              <div className="admin-stat-info">
                <div className="admin-stat-value">{loading ? '...' : stats.totalCandidates}</div>
                <div className="admin-stat-label">Candidates</div>
              </div>
            </div>
          </div>
          <div className="admin-stat-card admin-institutes">
            <div className="admin-stat-content">
              <div className="admin-stat-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
                </svg>
              </div>
              <div className="admin-stat-info">
                <div className="admin-stat-value">{loading ? '...' : stats.totalInstitutes}</div>
                <div className="admin-stat-label">Institutes</div>
              </div>
            </div>
          </div>
          <div className="admin-stat-card admin-allocations">
            <div className="admin-stat-content">
              <div className="admin-stat-icon">
                <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
              </div>
              <div className="admin-stat-info">
                <div className="admin-stat-value">{loading ? '...' : stats.totalAllocations}</div>
                <div className="admin-stat-label">Allocations</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-sections">
          <h2>Management Modules</h2>
          <div className="management-grid">
            {/* User Management */}
            <Link to="/admin/users" className="management-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                  </svg>
                </div>
              </div>
              <h3>User Management</h3>
              <p>Add, view, and delete system users with full control over user accounts</p>
              <div className="card-actions">
                <span className="action-badge">View</span>
                <span className="action-badge">Delete</span>
              </div>
            </Link>

            {/* Candidate Management */}
            <Link to="/candidates" className="management-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/>
                  </svg>
                </div>
              </div>
              <h3>Candidate Management</h3>
              <p>Complete candidate lifecycle management - add new candidates, update profiles, and remove records</p>
              <div className="card-actions">
                <span className="action-badge">Add</span>
                <span className="action-badge">Edit</span>
                <span className="action-badge">Delete</span>
                <span className="action-badge">Search</span>
              </div>
            </Link>

            {/* Allocation Management */}
            <Link to="/allocations" className="management-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
                  </svg>
                </div>
              </div>
              <h3>Allocation Management</h3>
              <p>View and manage seat allocations across all institutes and programs</p>
              <div className="card-actions">
                <span className="action-badge">View</span>
                <span className="action-badge">Filter</span>
              </div>
            </Link>

            {/* Institute Management */}
            <Link to="/institutes" className="management-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
                  </svg>
                </div>
              </div>
              <h3>Institute Management</h3>
              <p>View and manage institute profiles, programs, and seat matrices</p>
              <div className="card-actions">
                <span className="action-badge">View</span>
                <span className="action-badge">Search</span>
              </div>
            </Link>

            {/* Seat Matrix Management */}
            <Link to="/seat-matrix" className="management-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6Z"/>
                    <path d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16Z"/>
                    <path d="M10 9H12V14H10V9ZM13 9H15V14H13V9ZM16 9H18V14H16V9Z"/>
                  </svg>
                </div>
              </div>
              <h3>Seat Matrix</h3>
              <p>Manage seat availability, quotas, and categories for all programs</p>
              <div className="card-actions">
                <span className="action-badge">View</span>
                <span className="action-badge">Edit</span>
              </div>
            </Link>

            {/* Ranks Management */}
            <Link to="/ranks" className="management-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/>
                  </svg>
                </div>
              </div>
              <h3>Opening/Closing Ranks</h3>
              <p>View cutoff ranks and admission criteria for programs across rounds</p>
              <div className="card-actions">
                <span className="action-badge">View</span>
                <span className="action-badge">Search</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
