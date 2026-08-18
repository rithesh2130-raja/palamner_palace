import { apiClient } from './apiClient.js';
import { MOCK_PRODUCTS } from '../../constants/mockProducts.js';
import { MOCK_CATEGORIES } from '../../constants/mockCategories.js';

export const productService = {
  async getProducts(params = {}) {
    try {
      const data = await apiClient.get('/products', { params });
      return data?.data || MOCK_PRODUCTS;
    } catch {
      // Fallback to local mock filtering
      let products = [...MOCK_PRODUCTS];
      if (params.category) {
        products = products.filter(p => p.categorySlug === params.category);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }
      if (params.filter === 'bestseller') {
        products = products.filter(p => p.isBestseller);
      }
      if (params.filter === 'new') {
        products = products.filter(p => p.isNew);
      }
      return products;
    }
  },

  async getProductById(id) {
    try {
      const data = await apiClient.get(`/products/${id}`);
      return data?.data || MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    } catch {
      return MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    }
  },

  async getCategories() {
    try {
      const data = await apiClient.get('/categories');
      return data?.data || MOCK_CATEGORIES;
    } catch {
      return MOCK_CATEGORIES;
    }
  }
};
