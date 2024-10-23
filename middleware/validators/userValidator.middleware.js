const { body } = require('express-validator');

exports.loginUserSchema = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password', 'Password has to be valid')
        .isLength({ min: 8 })
        .trim()
];

exports.createUserSchema = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('name', 'Please enter a valid name')
        .isLength({ min: 1 })
        .trim(),
    body('password', 'Password has to be valid')
        .isLength({ min: 8 })
        .trim()
];

exports.resetUserSchema = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password', 'Password has to be valid')
        .isLength({ min: 8 })
        .trim()
];