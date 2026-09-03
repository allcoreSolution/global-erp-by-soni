const express = require('express');
const router = express.Router();
const { createSale, getSales, updateSale, deleteSale, validateCoupon } = require('../controllers/saleController');
const { protect, checkPermission } = require('../middlewares/authMiddleware');

router.get('/', protect, getSales);
router.post('/', protect, checkPermission('create_sales'), createSale);
router.put('/:id', protect, checkPermission('create_sales'), updateSale);
router.delete('/:id', protect, checkPermission('create_sales'), deleteSale);
router.get('/coupon/validate/:code', protect, validateCoupon);

module.exports = router;
