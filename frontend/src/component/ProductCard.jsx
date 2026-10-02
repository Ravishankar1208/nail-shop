import { Link, useNavigate } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import { useCart } from '../context/Context';
import './component.css';

function ProductCard({ product, compact = false }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <article className={`product-card ${compact ? 'compact' : ''}`}>
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`}>
          <ImageWithFallback src={product.image} alt={product.name} className="product-image" />
        </Link>
        <button
          type="button"
          className={`wishlist-button ${isWishlisted(product.id) ? 'active' : ''}`}
          aria-label={`Save ${product.name} to wishlist`}
          onClick={() => toggleWishlist(product)}
        >
          {isWishlisted(product.id) ? '♥' : '♡'}
        </button>
      </div>

      <div className="product-body">
        <div className="product-meta">
          <span className="product-shade">{product.shade}</span>
          <span className="product-rating">★ {product.rating}</span>
        </div>
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3>{product.name}</h3>
        </Link>
        <div className="product-price-row">
          <div className="price-block">
            <span className="price">₹{product.price}</span>
            {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
          </div>
          <div className="product-actions-row">
            <button type="button" className="mini-cart-button" onClick={() => addToCart(product, 1)}>
              Add to cart
            </button>
            <button type="button" className="buy-link" onClick={handleBuyNow}>
              Buy now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
