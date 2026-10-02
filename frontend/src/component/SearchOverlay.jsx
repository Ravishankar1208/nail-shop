import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, normalizeProduct } from '../services/api';

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClick = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClick);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    const searchProducts = async () => {
      const value = query.trim();

      if (!value) {
        setResults([]);
        setError('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await getProducts({ search: value });
        if (mounted) setResults(data.slice(0, 6));
      } catch (err) {
        if (mounted) setError('Unable to search products.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    searchProducts();

    return () => {
      mounted = false;
    };
  }, [open, query]);

  if (!open) return null;

  return (
    <div className="search-overlay" aria-label="Product search overlay">
      <div className="search-panel" ref={overlayRef}>
        <div className="search-header">
          <span className="search-icon">⌕</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for polish, shade, or category"
            aria-label="Search products"
          />
          <button type="button" className="close-search" onClick={onClose} aria-label="Close search">
            ×
          </button>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="search-empty-state">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="search-empty-state">
              <p>{error}</p>
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <button
                type="button"
                key={product.id}
                className="search-result-item"
                onClick={() => {
                  navigate(`/product/${product.id}`);
                  onClose();
                }}
              >
                <span className="search-result-image-wrap">
                  <img src={normalizeProduct(product).image} alt={product.name} />
                </span>
                <span className="search-result-copy">
                  <strong>{product.name}</strong>
                  <small>
                    {product.category} · {product.shade}
                  </small>
                  <em>₹{product.price}</em>
                </span>
              </button>
            ))
          ) : (
            <div className="search-empty-state">
              <p>No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
