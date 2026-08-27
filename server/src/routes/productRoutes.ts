import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
