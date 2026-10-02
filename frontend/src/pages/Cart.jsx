import { Link } from 'react-router-dom';
import Button from '../component/Buttom';
import { useCart } from '../context/Context';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container page-section">
        <div className="empty-state cart-empty">
          <h1>Your cart is empty.</h1>
          <p>Explore our signature shades and bring home your next favorite color.</p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section cart-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cart</p>
          <h1>Your selection.</h1>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <article key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.shade}</p>
                <span>₹{item.price}</span>
              </div>
              <div className="quantity-picker">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button type="button" className="remove-button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h3>Order summary</h3>
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
          <Link to="/checkout" className="checkout-link-wrap">
            <Button className="checkout-button">Proceed to Checkout</Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
