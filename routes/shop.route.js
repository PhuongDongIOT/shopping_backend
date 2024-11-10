const express = require('express');
const shopController = require('../controllers/shop.controller');
const auth = require('../middleware/auth.middleware');
const { createReviewSchema, createOrderSchema } = require('../middleware/validators/reviewValidator.middleware');

const router = express.Router();

router.get('/cart/:cartId', auth(), shopController.getCart);
router.post('/cart', auth(), shopController.postCart);
router.post('/cart-delete-item', auth(), shopController.postCartDeleteProduct);
router.post('/orders', auth(), shopController.postOrder);
router.get('/orders', shopController.getListOrders);
router.get('/orders/all', shopController.getListAllOrders);
router.get('/orders/detroy', shopController.getListAllOrdersDetroy);
router.get('/orders/review', shopController.getListAllOrdersReview);
router.delete('/orders', createOrderSchema, shopController.deleteOrder);
router.post('/reviews', createReviewSchema, auth(), shopController.postReview);
router.post('/reviews/order', shopController.postReviewOrder);
router.post('/order/update', shopController.updateOrder);
router.get('/orders/:orderId', auth(), shopController.getOrders);

module.exports = router;
