// frontend/src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'users') {
        const usersData = await adminService.getUsers();
        setUsers(usersData);
      } else if (activeTab === 'stats') {
        const statsData = await adminService.getStats();
        setStats(statsData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminService.blockUser(userId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminService.unblockUser(userId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to unblock user');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await adminService.makeAdmin(userId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to make user admin');
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      await adminService.removeAdmin(userId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to remove admin privileges');
    }
  };

  const renderUsers = () => (
    <div className="users-table">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_blocked ? 'Blocked' : 'Active'}</td>
              <td>{user.is_admin ? 'Admin' : 'User'}</td>
              <td>
                {user.is_blocked ? (
                  <button onClick={() => handleUnblockUser(user.id)}>Unblock</button>
                ) : (
                  <button onClick={() => handleBlockUser(user.id)}>Block</button>
                )}
                {user.is_admin ? (
                  <button onClick={() => handleRemoveAdmin(user.id)}>Remove Admin</button>
                ) : (
                  <button onClick={() => handleMakeAdmin(user.id)}>Make Admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStats = () => (
    <div className="stats-container">
      <h2>Website Statistics</h2>
      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.total_users}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{stats.total_orders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Threads</h3>
              <p>{stats.total_threads}</p>
            </div>
          </div>

          <div className="recent-orders">
            <h3>Recent Orders</h3>
            <ul>
              {stats.recent_orders.map(order => (
                <li key={order.id}>
                  Order #{order.id} by {order.user} - {new Date(order.created_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>

          <div className="blocked-users">
            <h3>Blocked Users</h3>
            <ul>
              {stats.blocked_users.map(username => (
                <li key={username}>{username}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''} 
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          activeTab === 'users' ? renderUsers() : renderStats()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 