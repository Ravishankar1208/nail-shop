import { useEffect, useState } from 'react';
import ImageWithFallback from '../component/ImageWithFallback';
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from '../services/api';

const initialProductForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  oldPrice: '',
  stock: 20,
  category: 'Gel Polish',
  shade: '',
  color: 'Pink',
  image: '',
  featured: false,
  bestseller: false,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialProductForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(initialProductForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      stock: product.stock ?? 20,
      category: product.category || 'Gel Polish',
      shade: product.shade || '',
      color: product.color || 'Pink',
      image: product.image || '',
      featured: Boolean(product.featured),
      bestseller: Boolean(product.bestseller),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : Number(form.price),
        stock: Number(form.stock),
        slug:
          form.slug ||
          form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      closeModal();
      await fetchCatalog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      await fetchCatalog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Product Management</h1>
        </div>
        <button type="button" className="admin-btn" onClick={openAddModal}>
          + Add New Product
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="admin-empty">No products found. Add your first product.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Shade / Color</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id || product.id}>
                  <td>
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="admin-table-img"
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.bestseller && (
                      <span className="admin-badge badge-confirmed" style={{ marginLeft: '0.5rem' }}>
                        Bestseller
                      </span>
                    )}
                  </td>
                  <td>{product.category}</td>
                  <td>{product.shade || product.color}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock ?? '—'}</td>
                  <td>{product.featured ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="admin-actions-cell">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(product._id || product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <label>
                  Product Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Velvet Rose"
                    required
                  />
                </label>
                <label>
                  Slug (optional)
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e.g. velvet-rose"
                  />
                </label>
              </div>

              <label>
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description and features"
                  rows="3"
                  required
                />
              </label>

              <div className="admin-form-row">
                <label>
                  Price (₹) *
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    placeholder="599"
                    required
                  />
                </label>
                <label>
                  Original / Old Price (₹)
                  <input
                    type="number"
                    name="oldPrice"
                    value={form.oldPrice}
                    onChange={handleChange}
                    min="0"
                    placeholder="749"
                  />
                </label>
              </div>

              <div className="admin-form-row">
                <label>
                  Category *
                  <select name="category" value={form.category} onChange={handleChange} required>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat._id || cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Gel Polish">Gel Polish</option>
                        <option value="Classic Nail Color">Classic Nail Color</option>
                        <option value="Nail Art">Nail Art</option>
                        <option value="Care Essentials">Care Essentials</option>
                        <option value="Accessories">Accessories</option>
                      </>
                    )}
                  </select>
                </label>

                <label>
                  Stock *
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </label>
              </div>

              <div className="admin-form-row">
                <label>
                  Shade Name
                  <input
                    name="shade"
                    value={form.shade}
                    onChange={handleChange}
                    placeholder="e.g. Rose Satin"
                  />
                </label>
                <label>
                  Color Family
                  <input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    placeholder="e.g. Pink, Red, Nude"
                  />
                </label>
              </div>

              <label>
                Image URL
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                />
              </label>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  Featured Product
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={form.bestseller}
                    onChange={handleChange}
                  />
                  Bestseller
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
