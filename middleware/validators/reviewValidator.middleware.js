const { body } = require('express-validator');

exports.createReviewSchema = [
    body('comment', 'Please enter a valid comment')
        .isLength({ min: 1 })
        .trim()
];

exports.createOrderSchema = [
    body('order_id', 'Please enter a valid order')
        .isLength({ min: 1 })
        .trim(),
    body('message', 'Please enter a valid message')
        .isLength({ min: 1 })
        .trim()
];
