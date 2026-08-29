import { Router } from 'express';
import {
  getProducts,
  getSearchSuggestions,
  getFeaturedProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

// GET /api/v1/products
router.get('/', getProducts);

// GET /api/v1/products/suggestions
router.get('/suggestions', getSearchSuggestions);

// GET /api/v1/products/featured
router.get('/featured', getFeaturedProducts);

// GET /api/v1/products/category/:category
router.get('/category/:category', getProductsByCategory);

// GET /api/v1/products/slug/:slug
router.get('/slug/:slug', getProductBySlug);

// GET /api/v1/products/:id
router.get('/:id', getProductById);

// POST /api/v1/products
router.post('/', createProduct);

// PATCH /api/v1/products/:id
router.patch('/:id', updateProduct);

// DELETE /api/v1/products/:id
router.delete('/:id', deleteProduct);

export default router;
