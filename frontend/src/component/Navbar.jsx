import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';
import { useCart } from '../context/Context';
import { useAuth } from '../context/AuthContext';
import './component.css';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/categories' },
  { label: 'My Orders', to: '/orders' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { itemCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => {
    setMobileOpen(false);
    setAccountDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-shell">
          <Link to="/" className="brand" onClick={closeMenu} aria-label="Nail Atelier home">
            <span className="brand-mark">N</span>
            <span className="brand-text">Nail Atelier</span>
          </Link>

          <nav className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <div className="nav-auth" ref={dropdownRef}>
              {isAuthenticated && user ? (
                <div className="account-dropdown-wrap">
                  <button
                    type="button"
                    className="nav-auth-link nav-account-btn"
                    onClick={() => setAccountDropdownOpen((prev) => !prev)}
                    aria-expanded={accountDropdownOpen}
                    aria-label="Account menu"
                  >
                    <span>Account</span>
                    <span className="dropdown-caret">▾</span>
                  </button>

                  {accountDropdownOpen && (
                    <div className="account-dropdown-menu">
                      <div className="account-dropdown-header">
                        <span className="dropdown-user-name">{user.name || 'Valued Client'}</span>
                        <span className="dropdown-user-email">{user.email}</span>
                      </div>
                      <div className="account-dropdown-divider" />
                      <Link
                        to="/account"
                        className="account-dropdown-item"
                        onClick={closeMenu}
                      >
                        Account
                      </Link>
                      <Link
                        to="/orders"
                        className="account-dropdown-item"
                        onClick={closeMenu}
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="account-dropdown-item admin-link-highlight"
                          onClick={closeMenu}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <div className="account-dropdown-divider" />
                      <button
                        type="button"
                        className="account-dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-auth-link nav-login-link" onClick={closeMenu}>
                  Login
                </Link>
              )}
            </div>

            <button
              className="icon-button"
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
            >
              ⌕
            </button>
            <Link to="/cart" className="cart-button" aria-label="View cart">
              <span className="cart-icon">🛍</span>
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>

            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Navbar;
