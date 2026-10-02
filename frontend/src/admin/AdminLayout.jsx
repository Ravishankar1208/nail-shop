import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-mark">N</span>
          <span>Nail Atelier</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
        </nav>

        <button type="button" className="admin-logout" onClick={logout}>Logout</button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
