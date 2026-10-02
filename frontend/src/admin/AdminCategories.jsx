import { useEffect, useState } from 'react';
import ImageWithFallback from '../component/ImageWithFallback';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../services/api';

const initialCategoryForm = {
  name: '',
  slug: '',
  description: '',
  image: '',
};

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(initialCategoryForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(initialCategoryForm);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        slug:
          form.slug.trim() ||
          form.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
        description: form.description.trim(),
        image: form.image.trim(),
      };

      if (editingCategory) {
        await updateCategory(editingCategory._id || editingCategory.slug, payload);
      } else {
        await createCategory(payload);
      }

      closeModal();
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategory(categoryId);
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="eyebrow">Taxonomy</p>
          <h1>Category Management</h1>
        </div>
        <button type="button" className="admin-btn" onClick={openAddModal}>
          + Add New Category
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="admin-empty">No categories found. Add your first category.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id || category.slug}>
                  <td>
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="admin-table-img"
                    />
                  </td>
                  <td>
                    <strong>{category.name}</strong>
                  </td>
                  <td>
                    <code>{category.slug}</code>
                  </td>
                  <td style={{ maxWidth: '300px' }}>{category.description || '—'}</td>
                  <td>
                    <div className="admin-actions-cell">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        onClick={() => openEditModal(category)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        onClick={() => handleDelete(category._id || category.slug)}
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
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <label>
                  Category Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Gel Polish"
                    required
                  />
                </label>
                <label>
                  Slug (optional)
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e.g. gel-polish"
                  />
                </label>
              </div>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Category description"
                  rows="3"
                />
              </label>

              <label>
                Image URL
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                />
              </label>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn" disabled={submitting}>
                  {submitting
                    ? 'Saving...'
                    : editingCategory
                      ? 'Update Category'
                      : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
