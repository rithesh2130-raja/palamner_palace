import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { UserContext } from '../../context/UserContext';
import { Save } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [roles, setRoles] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const { userInfo } = useContext(UserContext);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to load user directories');
      const data = await res.json();
      
      // Filter users who are admin or staff
      const staffList = data.filter((u) => u.isAdmin || u.role !== 'Customer');
      setUsers(staffList);

      const userRoles = {};
      staffList.forEach((u) => {
        userRoles[u._id] = u.role;
      });
      setRoles(userRoles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (id, val) => {
    setRoles((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const saveRoleHandler = async (user) => {
    const newRole = roles[user._id];
    if (newRole === undefined || newRole === user.role) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          role: newRole,
          isAdmin: newRole !== 'Customer', // toggle admin flag if role changes to Customer
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update role');

      alert('Staff permission role updated successfully!');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const availableRoles = ['SuperAdmin', 'ProductManager', 'OrderManager', 'Finance', 'Customer'];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Administrative Staff Permissions & RBAC</h1>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>STAFF NAME</th>
                  <th>EMAIL</th>
                  <th>CURRENT ROLE</th>
                  <th>ASSIGN ROLE PERMISSIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-success" style={{ backgroundColor: user.role === 'SuperAdmin' ? '#fee2e2' : '#eff6ff', color: user.role === 'SuperAdmin' ? '#991b1b' : 'var(--secondary)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          className="qty-select"
                          style={{ width: '180px', padding: '0.4rem', height: '36px' }}
                          value={roles[user._id] || 'Customer'}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={user._id === userInfo._id} // can't edit own role
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => saveRoleHandler(user)}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          disabled={actionLoading || roles[user._id] === user.role || user._id === userInfo._id}
                        >
                          <Save size={12} /> Save
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
