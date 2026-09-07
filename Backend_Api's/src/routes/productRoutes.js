const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  addCategory,
  getCategories,
  addBrand,
  getBrands
} = require('../controllers/productController');
const { protect, checkPermission } = require('../middlewares/authMiddleware');

// Product Routes
router.get('/', protect, getProducts);
router.get('/search', protect, searchProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, checkPermission('manage_stock'), addProduct);
router.put('/:id', protect, checkPermission('manage_stock'), updateProduct);
router.delete('/:id', protect, checkPermission('manage_stock'), deleteProduct);

// Category Routes
router.get('/categories', protect, getCategories);
router.post('/categories', protect, checkPermission('manage_stock'), addCategory);

// Brand Routes
router.get('/brands', protect, getBrands);
router.post('/brands', protect, checkPermission('manage_stock'), addBrand);

module.exports = router;
