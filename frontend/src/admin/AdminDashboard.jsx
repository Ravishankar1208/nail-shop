import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsResponse, ordersResponse] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/recent-orders'),
        ]);

        setStats(statsResponse.data?.stats || null);
        setOrders(ordersResponse.data?.orders || []);
      } catch (dashboardError) {
        setError(dashboardError.response?.data?.message || 'Unable to load admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading dashboard…</div>
      ) : (
        <>
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <span>Total Products</span>
              <strong>{stats?.totalProducts ?? '—'}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Total Orders</span>
              <strong>{stats?.totalOrders ?? '—'}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Total Users</span>
              <strong>{stats?.totalUsers ?? '—'}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Total Sales</span>
              <strong>{stats?.totalSales != null ? `₹${stats.totalSales}` : '—'}</strong>
            </div>
          </div>

          <div className="admin-content-grid">
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Recent Orders</h2>
                <Link to="/admin/orders">View all</Link>
              </div>

              {orders.length === 0 ? (
                <p className="admin-empty">No orders yet.</p>
              ) : (
                <ul className="admin-order-list">
                  {orders.map((order) => (
                    <li key={order._id}>
                      <div>
                        <strong>{order.user?.name || 'Customer'}</strong>
                        <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                      </div>
                      <span>{order.orderStatus}</span>
                      <em>₹{order.totalAmount}</em>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="admin-actions">
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/orders">Manage Orders</Link>
                <Link to="/admin/users">Manage Users</Link>
                <Link to="/admin/categories">Manage Categories</Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
