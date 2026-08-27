import { apiClient } from './apiClient.js';
import { getProducts, getProduct, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../productService.js';

export const productApi = {
  getProducts,
  getProduct,
  getProductById: getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  async getCategories() {
    try {
      const res = await apiClient.get('/categories');
      return res?.data || ['Gaming', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'];
    } catch {
      return ['Gaming', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'];
    }
  }
};

export default productApi;
