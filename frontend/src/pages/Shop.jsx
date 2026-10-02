import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../component/ProductCard';
import SearchBar from '../component/SearchBar';
import categories from '../data/category';
import { getProducts } from '../services/api';

const allColors = [
  'All',
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

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const paramValue = searchParams.get('category');
    if (!paramValue) {
      setSelectedCategory('All');
      return;
    }

    const matchedCategory = categories.find(
      (category) =>
        category.slug === paramValue ||
        category.name.toLowerCase() === paramValue.toLowerCase() ||
        category.id === paramValue,
    );

    setSelectedCategory(matchedCategory ? matchedCategory.name : 'All');
  }, [searchParams]);

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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (query.trim()) {
      const search = query.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          (product.shade || '').toLowerCase().includes(search) ||
          (product.category || '').toLowerCase().includes(search),
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (selectedColor !== 'All') {
      result = result.filter((product) => product.color === selectedColor);
    }

    result = result.filter((product) => product.price <= maxPrice);

    switch (sortBy) {
      case 'low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }

    return result;
  }, [maxPrice, products, query, selectedCategory, selectedColor, sortBy]);

  const renderProductContent = () => {
    if (loading) {
      return (
        <div className="empty-state shop-empty">
          <h3>Loading products...</h3>
        </div>
      );
    }

    if (error) {
      return (
        <div className="empty-state shop-empty">
          <h3>Unable to load products. Please try again.</h3>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="empty-state shop-empty">
          <h3>No products found.</h3>
          <p>Try another shade, category, or price range.</p>
        </div>
      );
    }

    return filteredProducts.map((product) => <ProductCard key={product.id} product={product} />);
  };

  return (
    <div className="page-section container">
      <div className="breadcrumbs">
        <span>Home</span>
        <span>/</span>
        <strong>Shop</strong>
      </div>

      <div className="page-header">
        <div>
          <p className="eyebrow">Shop</p>
          <h1>Curated nail beauty.</h1>
        </div>
      </div>

      <div className="shop-tools">
        <SearchBar value={query} onChange={setQuery} />

        <div className="shop-filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => {
                const nextCategory = e.target.value;
                setSelectedCategory(nextCategory);
                const nextParams = new URLSearchParams(searchParams);
                if (nextCategory === 'All') {
                  nextParams.delete('category');
                } else {
                  const matchedCategory = categories.find((category) => category.name === nextCategory);
                  nextParams.set('category', matchedCategory?.slug || nextCategory);
                }
                setSearchParams(nextParams, { replace: true });
              }}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="color-filter">Color</label>
            <select id="color-filter" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
              {allColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group price-group">
            <label htmlFor="price-filter">Price</label>
            <input
              id="price-filter"
              type="range"
              min="300"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
            <span>Up to ₹{maxPrice}</span>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Sort by</label>
            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low-high">Price Low to High</option>
              <option value="high-low">Price High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-meta">
        <span>{filteredProducts.length} items</span>
      </div>

      <div className="product-grid shop-grid">{renderProductContent()}</div>
    </div>
  );
}

export default Shop;
