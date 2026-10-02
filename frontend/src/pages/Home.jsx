import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../component/ProductCard';
import Button from '../component/Buttom';
import categories from '../data/category';
import { getProducts } from '../services/api';

const featuredCategories = categories;
const palette = [
  'Nude',
  'Pink',
  'Red',
  'Burgundy',
  'Purple',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Brown',
  'White',
  'Glitter',
];

const testimonials = [
  {
    name: 'Aarohi S.',
    quote:
      'The color payoff is incredible and the finish looks salon-grade. My go-to shades are always from Nail Atelier.',
    rating: 5,
  },
  {
    name: 'Meher G.',
    quote:
      'Every polish feels luxurious and the nude shades are so flattering. It truly looks like premium beauty packaging.',
    rating: 5,
  },
  {
    name: 'Tara N.',
    quote:
      'The texture, longevity, and finish are exceptional. The burgundy and rose shades are stunning in person.',
    rating: 5,
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) setError('Unable to load products. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const bestSellers = products.filter((product) => product.bestseller).slice(0, 4);

  return (
    <>
      <div className="announcement-bar">
        <div className="container">FREE SHIPPING ON ORDERS OVER ₹999</div>
      </div>

      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy reveal-up">
            <p className="eyebrow">Signature shade edit</p>
            <h1>Color Your Confidence.</h1>
            <p className="hero-text">
              Discover sophisticated nail colors crafted to make every look unforgettable.
            </p>
            <div className="hero-actions">
              <Link to="/shop">
                <Button>Shop Collection</Button>
              </Link>
              <Link to="/categories">
                <Button variant="secondary">Explore Colors</Button>
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>12k+</strong>
                <span>Happy clients</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Beauty rating</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Cruelty free</span>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal-up delay-1">
            <div className="hero-card hero-card-main">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
                alt="Nail polish and manicure styling"
              />
            </div>
            <div className="floating-badge">
              <span className="badge-dot" />
              New Rose Collection
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Featured categories</p>
            <h2>Curated for every finish.</h2>
          </div>
          <div className="category-grid">
            {featuredCategories.map((category) => (
              <Link key={category.id} to="/shop" className="category-card reveal-up">
                <img src={category.image} alt={category.name} />
                <div className="category-card-body">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span>Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Color collection</p>
            <h2>Find your signature shade.</h2>
          </div>
          <div className="color-grid">
            {palette.map((color, index) => (
              <div key={color} className="color-item reveal-up" style={{ animationDelay: `${index * 80}ms` }}>
                <span
                  className="color-swatch"
                  style={{
                    background:
                      color === 'Nude'
                        ? '#d9c3ae'
                        : color === 'Pink'
                          ? '#e7b8c9'
                          : color === 'Red'
                            ? '#b33242'
                            : color === 'Burgundy'
                              ? '#592233'
                              : color === 'Purple'
                                ? '#8c5aa2'
                                : color === 'Blue'
                                  ? '#6a8ebc'
                                  : color === 'Green'
                                    ? '#779977'
                                    : color === 'Yellow'
                                      ? '#e6c470'
                                      : color === 'Orange'
                                        ? '#d58b4f'
                                        : color === 'Brown'
                                          ? '#8c6250'
                                          : color === 'White'
                                            ? '#f5f1ee'
                                            : '#d8d2cf',
                  }}
                />
                {color}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Best sellers</p>
              <h2>Beauty essentials everyone loves.</h2>
            </div>
            <Link to="/shop" className="text-link">View all</Link>
          </div>

          <div className="product-grid">
            {loading ? (
              <div className="empty-state shop-empty">
                <h3>Loading products...</h3>
              </div>
            ) : error ? (
              <div className="empty-state shop-empty">
                <h3>Unable to load products. Please try again.</h3>
              </div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="empty-state shop-empty">
                <h3>No products found.</h3>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section editorial-section">
        <div className="container editorial-layout">
          <div className="editorial-image reveal-up">
            <img
              src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=80"
              alt="Beauty brand editorial manicure"
            />
          </div>
          <div className="editorial-copy reveal-up delay-1">
            <p className="eyebrow">Beauty in every shade</p>
            <h2>From timeless nudes to bold statement colors.</h2>
            <p>
              Our collection is designed to help you express your personality through color, elevate your daily rituals,
              and turn a simple manicure into an experience that feels like self-expression.
            </p>
            <Link to="/about">
              <Button variant="secondary">Our Story</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section promo-banner-wrap">
        <div className="container promo-banner">
          <div>
            <p className="eyebrow">Your next signature shade</p>
            <h2>Your next signature shade is waiting.</h2>
          </div>
          <Link to="/shop">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Testimonials</p>
            <h2>What our community says.</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card reveal-up">
                <div className="stars">{'★'.repeat(item.rating)}</div>
                <p>“{item.quote}”</p>
                <strong>{item.name}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section newsletter-section">
        <div className="container newsletter-box">
          <div>
            <p className="eyebrow">Stay in the color</p>
            <h2>Get new shade launches, beauty inspiration and exclusive offers.</h2>
          </div>
          <form className="newsletter-form">
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" />
            <button type="submit">Join</button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
