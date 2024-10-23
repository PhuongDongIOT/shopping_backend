const express = require('express');
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const { createCategorySchema } = require('../middleware/validators/categoryValidator.middleware');
const { createProductSchema, updateProductSchema } = require('../middleware/validators/productValidator.middleware');

const router = express.Router();

router.post(
    '/add-category',
    createCategorySchema,
    // auth(),
    adminController.postAddCategory
);
router.get(
    '/category',
    adminController.getListCategory
);
router.get('/product', adminController.getListProduct);
router.get('/product/:productId', adminController.getProduct);
router.post(
    '/add-product',
    createProductSchema,
    // auth(),
    adminController.postAddProduct
);
router.post(
    '/edit-product',
    updateProductSchema,
    auth(),
    adminController.postEditProduct
);
router.delete('/product/:productId', auth(), adminController.deleteProduct);

module.exports = router;

