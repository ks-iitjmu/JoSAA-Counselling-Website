import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './UserManagement.css';

interface User {
  UserID: number;
  Username: string;
  Role: string;
  Email: string;
  CandidateID?: number;
  InstituteCode?: string;
  CandidateName?: string;
  InstituteName?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAllUsers();
      setUsers(response.data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (userId === currentUser.userID) {
      setError('You cannot delete your own account');
      return;
    }

    try {
      setLoading(true);
      await authAPI.deleteUser(userId);
      setSuccessMessage('User deleted successfully!');
      setDeleteConfirm(null);
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.CandidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.InstituteName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'All' || user.Role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'role-admin';
      case 'Institute':
        return 'role-institute';
      case 'Student':
        return 'role-student';
      default:
        return '';
    }
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <p>View and manage system users</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by username, email, or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Administrator">Administrator</option>
          <option value="Institute">Institute</option>
          <option value="Student">Student</option>
        </select>
      </div>

      <div className="users-count">
        Showing {filteredUsers.length} users
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Associated Entity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.UserID}>
                <td>{user.UserID}</td>
                <td className="username">{user.Username}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.Role)}`}>
                    {user.Role}
                  </span>
                </td>
                <td>{user.Email || 'N/A'}</td>
                <td>
                  {user.Role === 'Student' && user.CandidateName && (
                    <span className="entity-info">
                      👤 {user.CandidateName} (ID: {user.CandidateID})
                    </span>
                  )}
                  {user.Role === 'Institute' && user.InstituteName && (
                    <span className="entity-info">
                      🏛️ {user.InstituteName} ({user.InstituteCode})
                    </span>
                  )}
                  {user.Role === 'Administrator' && (
                    <span className="entity-info">👑 System Admin</span>
                  )}
                </td>
                <td>
                  {user.UserID !== currentUser.userID ? (
                    deleteConfirm === user.UserID ? (
                      <div className="delete-confirm">
                        <span className="confirm-text">Delete?</span>
                        <button
                          className="btn-confirm"
                          onClick={() => handleDelete(user.UserID)}
                          disabled={loading}
                        >
                          Yes
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-delete"
                        onClick={() => setDeleteConfirm(user.UserID)}
                      >
                        🗑️ Delete
                      </button>
                    )
                  ) : (
                    <span className="current-user-badge">You</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          <div className="empty-icon">👥</div>
          <p>No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
