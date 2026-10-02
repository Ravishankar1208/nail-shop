import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../component/Buttom';
import ImageWithFallback from '../component/ImageWithFallback';
import ProductCard from '../component/ProductCard';
import { useCart } from '../context/Context';
import { getProductById, getProducts } from '../services/api';

function ProductDetals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const [singleProduct, catalog] = await Promise.all([getProductById(id), getProducts()]);
        if (mounted) {
          setProduct(singleProduct);
          setAllProducts(catalog);
        }
      } catch (err) {
        if (mounted) {
          setProduct(null);
          setError('Unable to load product details.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [allProducts, product]);

  if (loading) {
    return (
      <div className="container page-section empty-state">
        <h1>Loading product...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container page-section empty-state">
        <h1>Product not found</h1>
        <p>The shade you are looking for isn’t available right now.</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container page-section product-detail-page">
      <div className="breadcrumbs">
        <span>Home</span>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <div className="product-detail-layout">
        <div className="product-gallery">
          <div className="gallery-main">
            <ImageWithFallback src={product.gallery[activeImage]} alt={product.name} />
          </div>
          <div className="gallery-thumbs">
            {product.gallery.map((image, idx) => (
              <button
                key={image}
                type="button"
                className={activeImage === idx ? 'thumb active' : 'thumb'}
                onClick={() => setActiveImage(idx)}
                aria-label={`View product image ${idx + 1}`}
              >
                <ImageWithFallback src={image} alt={`${product.name} view ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="detail-meta">
            <span className="product-rating">★ {product.rating}</span>
            <span>{product.reviews} reviews</span>
          </div>
          <div className="detail-price-row">
            <span className="price">₹{product.price}</span>
            {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
          </div>

          <div className="shade-block">
            <span>Shade</span>
            <div className="shade-chip">
              <span
                className="swatch"
                style={{
                  background:
                    product.color === 'Nude'
                      ? '#d9c3ae'
                      : product.color === 'Pink'
                        ? '#e7b8c9'
                        : product.color === 'Red'
                          ? '#b33242'
                          : product.color === 'Burgundy'
                            ? '#592233'
                            : product.color === 'Purple'
                              ? '#8c5aa2'
                              : product.color === 'Blue'
                                ? '#6a8ebc'
                                : product.color === 'Green'
                                  ? '#779977'
                                  : product.color === 'Yellow'
                                    ? '#e6c470'
                                    : product.color === 'Orange'
                                      ? '#d58b4f'
                                      : product.color === 'Brown'
                                        ? '#8c6250'
                                        : product.color === 'White'
                                          ? '#f5f1ee'
                                          : '#d8d2cf',
                }}
              />
              {product.shade}
            </div>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="purchase-row">
            <div className="quantity-picker" aria-label="Quantity selector">
              <button type="button" onClick={() => setQuantity((count) => Math.max(1, count - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((count) => count + 1)}>+</button>
            </div>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="secondary" onClick={handleBuyNow}>Buy Now</Button>
          </div>

          <div className="detail-actions">
            <button type="button" className={`text-button ${isWishlisted(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
              {isWishlisted(product.id) ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>

          <div className="info-boxes">
            <div>
              <strong>Product Info</strong>
              <p>Long-wear formula with a luminous satin finish and salon-inspired consistency.</p>
            </div>
            <div>
              <strong>Shipping</strong>
              <p>Free shipping on orders over ₹999. Arrives in 3–5 business days.</p>
            </div>
            <div>
              <strong>Reviews</strong>
              <p>Highly rated for color depth, finish quality, and ease of application.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="details-extra section">
        <div className="section-heading">
          <p className="eyebrow">More details</p>
          <h2>Crafted for a polished finish.</h2>
        </div>
        <div className="detail-columns">
          <div>
            <h3>Product information</h3>
            <p>
              A luxurious nail polish designed to balance color richness with smooth application. Built for a refined
              manicure experience that feels both elevated and long-lasting.
            </p>
          </div>
          <div>
            <h3>Shipping information</h3>
            <p>
              Securely packed in premium protection. Complimentary shipping available for orders above ₹999 and easy
              returns within 7 days for unopened products.
            </p>
          </div>
          <div>
            <h3>Reviews</h3>
            <p>
              Loved by beauty enthusiasts for its finish, vibrant pigment and premium feel. Customers especially like the
              smooth application and rich opacity of the collection.
            </p>
          </div>
        </div>
      </div>

      <div className="section related-products">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Related products</p>
            <h2>You may also like.</h2>
          </div>
        </div>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetals;
