import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../component/Buttom';
import { useCart } from '../context/Context';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

function Checkout() {
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
        paymentMethod: form.paymentMethod,
        totalAmount: total,
      };

      const order = await createOrder(orderPayload);
      clearCart();
      setPlacedOrder(order);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Failed to place order. Please check details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container page-section">
        <div className="empty-state checkout-success-card">
          <div className="order-success-icon">✓</div>
          <p className="eyebrow">Thank You for Your Order</p>
          <h1>Order Placed Successfully!</h1>
          <p>
            Thank you, <strong>{placedOrder.shippingAddress?.fullName || form.fullName}</strong>!
            Your order <strong>#{placedOrder._id?.slice(-8).toUpperCase()}</strong> has been confirmed.
          </p>
          <p className="order-success-subtext">
            We will deliver your curated nail atelier essentials to {placedOrder.shippingAddress?.city},{' '}
            {placedOrder.shippingAddress?.state}. Payment mode: <strong>Cash on Delivery (COD)</strong>.
          </p>
          <div className="checkout-success-actions">
            <Link to="/orders">
              <Button>View My Orders</Button>
            </Link>
            <Link to="/shop">
              <Button variant="secondary">Keep Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <h1>Your cart is empty.</h1>
          <p>Add a few favorite shades before checking out.</p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section checkout-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Complete your order.</h1>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="auth-error" style={{ marginBottom: '1.5rem', background: 'rgba(77, 43, 52, 0.08)', color: '#4d2b34', borderColor: 'rgba(77, 43, 52, 0.2)' }}>
          Please <Link to="/login" state={{ from: '/checkout' }} style={{ fontWeight: 700, color: '#4d2b34', textDecoration: 'underline' }}>Login</Link> to complete your order and track your delivery.
        </div>
      )}

      {errorMessage && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{errorMessage}</div>}

      <div className="cart-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>1. Shipping Address</h3>
          <div className="field-grid">
            <label>
              Full Name *
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                required
              />
            </label>
            <label>
              Email Address *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </label>
          </div>

          <div className="field-grid">
            <label>
              Phone Number *
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
              />
            </label>
            <label>
              Postal Code (PIN) *
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="e.g. 400001"
                required
              />
            </label>
          </div>

          <label>
            Street Address *
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Flat/House No., Building, Street, Area"
              rows="3"
              required
            />
          </label>

          <div className="field-grid">
            <label>
              City *
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                required
              />
            </label>
            <label>
              State *
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                required
              />
            </label>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>2. Payment Method</h3>
            <div className="payment-options" style={{ display: 'grid', gap: '0.75rem', marginTop: '0.8rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(77, 43, 52, 0.2)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#685958' }}>
                    Pay with cash upon delivery of your beauty package.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Order...' : `Place Order (₹${total})`}
            </Button>
          </div>
        </form>

        <aside className="summary-card">
          <h3>Order summary</h3>
          {cartItems.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : `₹${shipping}`}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
