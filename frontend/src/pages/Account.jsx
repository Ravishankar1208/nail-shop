import { useAuth } from '../context/AuthContext';

function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="container page-section">Please log in to view your account.</div>;
  }

  return (
    <div className="container page-section account-page">
      <div className="auth-card">
        <h1>My Account</h1>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <button type="button" className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default AccountPage;
