import { useEffect, useState } from 'react';
import ImageWithFallback from '../component/ImageWithFallback';
import { getAdminOrders, updateAdminOrderStatus } from '../services/api';

const orderStatusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const paymentStatusOptions = [
  'pending',
  'paid',
  'failed',
  'refunded',
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus, newPaymentStatus) => {
    try {
      setUpdatingId(orderId);
      const updated = await updateAdminOrderStatus(orderId, newStatus, newPaymentStatus);
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? { ...order, ...updated } : order)),
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    return order.orderStatus === filterStatus;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Fulfillment</p>
          <h1>Order Management</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#5d4d4d', fontWeight: 600 }}>Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid rgba(77, 43, 52, 0.15)',
              background: '#fff',
              fontSize: '0.88rem',
            }}
          >
            <option value="all">All Statuses ({orders.length})</option>
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty">No orders found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{order.shippingAddress?.fullName || order.user?.name || 'Customer'}</strong>
                      <small style={{ display: 'block', color: '#786968' }}>
                        {order.user?.email || '—'}
                      </small>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <strong>₹{order.totalAmount}</strong>
                  </td>
                  <td>
                    <select
                      value={order.paymentStatus || 'pending'}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, order.orderStatus, e.target.value)
                      }
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid rgba(77, 43, 52, 0.15)',
                        background:
                          order.paymentStatus === 'paid'
                            ? '#e6f4ea'
                            : order.paymentStatus === 'failed'
                              ? '#fce8e6'
                              : '#fef7e0',
                        color:
                          order.paymentStatus === 'paid'
                            ? '#137333'
                            : order.paymentStatus === 'failed'
                              ? '#c5221f'
                              : '#b06000',
                      }}
                    >
                      {paymentStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.orderStatus || 'pending'}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value, order.paymentStatus)
                      }
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid rgba(77, 43, 52, 0.15)',
                        background:
                          order.orderStatus === 'delivered'
                            ? '#e6f4ea'
                            : order.orderStatus === 'cancelled'
                              ? '#fce8e6'
                              : '#e8f0fe',
                        color:
                          order.orderStatus === 'delivered'
                            ? '#137333'
                            : order.orderStatus === 'cancelled'
                              ? '#c5221f'
                              : '#1a73e8',
                      }}
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Order Details (#{selectedOrder._id?.slice(-8).toUpperCase()})</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8f4f1',
                  borderRadius: '16px',
                }}
              >
                <div>
                  <small style={{ color: '#786968', textTransform: 'uppercase' }}>Customer</small>
                  <p style={{ margin: '0.2rem 0 0', fontWeight: 600 }}>
                    {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}
                  </p>
                  <p style={{ margin: '0.1rem 0 0', fontSize: '0.86rem', color: '#5d4d4d' }}>
                    {selectedOrder.user?.email || '—'}
                  </p>
                  <p style={{ margin: '0.1rem 0 0', fontSize: '0.86rem', color: '#5d4d4d' }}>
                    Phone: {selectedOrder.shippingAddress?.phone || '—'}
                  </p>
                </div>

                <div>
                  <small style={{ color: '#786968', textTransform: 'uppercase' }}>Shipping Address</small>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>
                    {selectedOrder.shippingAddress?.address || '—'}, {selectedOrder.shippingAddress?.city},{' '}
                    {selectedOrder.shippingAddress?.state} ({selectedOrder.shippingAddress?.postalCode})
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.86rem', color: '#5d4d4d' }}>
                    Method: {(selectedOrder.paymentMethod || 'COD').toUpperCase()}
                  </p>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Order Items</h4>
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.8rem',
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid rgba(77, 43, 52, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ImageWithFallback
                          src={item.product?.image || '/nail-placeholder.svg'}
                          alt={item.name}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.92rem' }}>{item.name}</strong>
                          <small style={{ display: 'block', color: '#786968' }}>
                            Qty: {item.quantity} × ₹{item.price}
                          </small>
                        </div>
                      </div>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(77, 43, 52, 0.1)',
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Total Amount:</span>
                <strong style={{ fontSize: '1.3rem', color: '#4d2b34' }}>
                  ₹{selectedOrder.totalAmount}
                </strong>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
