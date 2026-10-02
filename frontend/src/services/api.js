import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.setToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

api.clearToken = () => {
  delete api.defaults.headers.common.Authorization;
};

// Initialize token from storage if present
try {
  const storedToken = localStorage.getItem('nail-shop-token');
  if (storedToken) {
    api.setToken(JSON.parse(storedToken));
  }
} catch {
  // Ignore storage read errors
}

export const normalizeProduct = (product) => {
  if (!product) return null;

  const primaryImage =
    product.image || product.images?.[0] || product.gallery?.[0] || '/nail-placeholder.svg';

  return {
    ...product,
    id: product.id ?? product._id,
    price: Number(product.price ?? 0),
    oldPrice: Number(product.oldPrice ?? product.originalPrice ?? product.price ?? 0),
    rating: Number(product.rating ?? 0),
    reviews: Number(product.reviews ?? 0),
    image: primaryImage,
    gallery: Array.isArray(product.gallery) && product.gallery.length > 0
      ? product.gallery
      : Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [primaryImage],
    shade: product.shade || product.name,
    color: product.color || product.shade || 'Nude',
    bestseller: Boolean(product.bestseller),
    featured: Boolean(product.featured),
  };
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return (response.data?.products || []).map(normalizeProduct).filter(Boolean);
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return normalizeProduct(response.data?.product);
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return normalizeProduct(response.data?.product);
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return normalizeProduct(response.data?.product);
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data?.categories || [];
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data?.category;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data?.category;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data?.orders || [];
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data?.order;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data?.stats;
};

export const getAdminRecentOrders = async () => {
  const response = await api.get('/admin/recent-orders');
  return response.data?.orders || [];
};

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data?.orders || [];
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data?.users || [];
};

export const updateAdminOrderStatus = async (id, status, paymentStatus) => {
  const response = await api.put(`/admin/orders/${id}/status`, { status, paymentStatus });
  return response.data?.order;
};

export default api;
