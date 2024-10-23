const { body } = require('express-validator');

exports.createProductSchema = [
    body('title', 'Please enter a valid title')
        .isLength({ min: 1 })
        .trim()
];

exports.updateProductSchema = [
    body('id', 'Please enter a valid index product')
        .isLength({ min: 1 })
        .trim(),
    body('title', 'Please enter a valid title')
        .isLength({ min: 1 })
        .trim()
];

