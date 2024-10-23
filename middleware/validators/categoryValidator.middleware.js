const { body } = require('express-validator');

exports.createCategorySchema = [
    body('name', 'Please enter a valid name')
        .isLength({ min: 1 })
        .trim(),
    body('slug', 'Please enter a valid slug')
        .isLength({ min: 1 })
        .trim()
];
