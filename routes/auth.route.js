const express = require('express');
const authController = require('../controllers/auth.controller');
// const auth = require('../middleware/auth.middleware');
const { createUserSchema, loginUserSchema, resetUserSchema } = require('../middleware/validators/userValidator.middleware');

const router = express.Router();

router.post(
    '/login',
    loginUserSchema,
    authController.postLogin
);
router.post(
    '/signup',
    createUserSchema,
    // auth(),
    authController.postSignup
);
router.post('/logout', authController.postLogout);
router.post('/update', authController.postUpdate);
router.post('/reset', authController.postReset);
router.post('/re-password', authController.postNewPassword);

module.exports = router;
