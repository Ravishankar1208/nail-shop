import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../component/Buttom';
import ImageWithFallback from '../component/ImageWithFallback';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyOrders();
        if (mounted) setOrders(data);
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Unable to load your orders. Please try again.',
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  if (!user) {
    return (
      <div className="container page-section empty-state">
        <h1>Please Log In</h1>
        <p>You must be signed in to view your order history.</p>
        <Link to="/login" state={{ from: '/orders' }}>
          <Button>Login to Account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-section orders-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Purchase History</p>
          <h1>My Orders</h1>
        </div>
      </div>

      {loading ? (
        <div className="empty-state shop-empty">
          <h3>Loading your orders...</h3>
        </div>
      ) : error ? (
        <div className="empty-state shop-empty">
          <h3>{error}</h3>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders placed yet.</h2>
          <p>Explore our luxury collection and indulge in premium shades.</p>
          <Link to="/shop">
            <Button>Explore Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'grid', gap: '1.75rem' }}>
          {orders.map((order) => (
            <article
              key={order._id}
              className="order-card"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(77, 43, 52, 0.1)',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: '0 12px 32px rgba(45, 28, 33, 0.05)',
              }}
            >
              <div
                className="order-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid rgba(77, 43, 52, 0.08)',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#786968', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </span>
                  <div style={{ fontSize: '0.92rem', color: '#4a3d3c', marginTop: '0.2rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      background:
                        order.orderStatus === 'delivered'
                          ? '#e6f4ea'
                          : order.orderStatus === 'cancelled'
                            ? '#fce8e6'
                            : '#fdf3e7',
                      color:
                        order.orderStatus === 'delivered'
                          ? '#137333'
                          : order.orderStatus === 'cancelled'
                            ? '#c5221f'
                            : '#b06000',
                    }}
                  >
                    {order.orderStatus}
                  </span>
                  <strong style={{ fontSize: '1.2rem', color: '#201b1b' }}>₹{order.totalAmount}</strong>
                </div>
              </div>

              <div className="order-items-grid" style={{ display: 'grid', gap: '1rem' }}>
                {order.items?.map((item, index) => (
                  <div
                    key={item.product?._id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.5rem 0',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#f4ede9',
                        flexShrink: 0,
                      }}
                    >
                      <ImageWithFallback
                        src={item.product?.image || '/nail-placeholder.svg'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#201b1b' }}>{item.name}</h4>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.86rem', color: '#786968' }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(77, 43, 52, 0.06)',
                    fontSize: '0.88rem',
                    color: '#655756',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span>
                    Delivery to: <strong>{order.shippingAddress.fullName}</strong>, {order.shippingAddress.address}, {order.shippingAddress.city} ({order.shippingAddress.postalCode})
                  </span>
                  <span>Payment: <strong>{(order.paymentMethod || 'COD').toUpperCase()}</strong> ({order.paymentStatus})</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
