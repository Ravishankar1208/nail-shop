import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../component/Buttom';
import ImageWithFallback from '../component/ImageWithFallback';
import { getCategories } from '../services/api';

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (mounted) setCategories(data);
      } catch (err) {
        if (mounted) setError('Unable to load categories. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Collections</p>
          <h1>Explore our nail universe.</h1>
        </div>
      </div>

      {loading ? (
        <div className="empty-state shop-empty">
          <h3>Loading categories...</h3>
        </div>
      ) : error ? (
        <div className="empty-state shop-empty">
          <h3>Unable to load categories. Please try again.</h3>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state shop-empty">
          <h3>No categories available right now.</h3>
        </div>
      ) : (
        <div className="category-collection-grid">
          {categories.map((category) => (
            <article key={category.id || category.slug} className="collection-card">
              <ImageWithFallback src={category.image} alt={category.name} className="collection-card-image" />
              <div className="collection-card-body">
                <p className="eyebrow small">{category.name}</p>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <Link to={`/shop?category=${encodeURIComponent(category.slug || category.name)}`}>
                  <Button variant="secondary">Explore</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Category;
