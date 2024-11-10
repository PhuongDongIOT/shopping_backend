const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { validationResult } = require('express-validator/check');
const UserModel = require('../models/user.model');
const credentialModel = require('../models/credential.model');

const passwwordDefault = '123456789';
let userSail = {
    user_id: null,
    hasher: '10',
    password_hash: '',
    password_salt: '10'
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });

    UserModel.findOne({ email: email })
        .then(async (user) => {
            if (!user || !password) return res.json({
                success: false,
                data: null,
                error: {}
            });
            const passwordResult = await credentialModel.findOne({ user_id: user.id })

            bcrypt.compare(password, passwordResult.password_hash)
                .then(doMatch => {
                    const secretKey = process.env.SECRET_JWT || "";
                    user.id = `${user.id}`
                    const token = doMatch ? jwt.sign({ ...user }, secretKey, { expiresIn: 60 * 60 }) : '';
                    if (token) return res.json({
                        success: true,
                        error: null,
                        data: {
                            token: token,
                            ...user
                        }
                    })
                    else return res.json({
                        success: false,
                        error: error
                    });
                })
                .catch(error => {
                    return res.json({
                        success: false,
                        error: error
                    });
                });
        })
        .catch(error => {
            return res.json({
                success: false,
                data: null,
                error: error
            });
        });
};

exports.postSignup = (req, res, next) => {
    const { slug, email, name, avatar, bio, company, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });

    bcrypt.hash(password, 12)
        .then(async (hashedPassword) => {
            const idUser = await UserModel.create({
                slug, email, name, avatar, bio, company, role
            })
            userSail.password_hash = hashedPassword
            userSail.user_id = idUser
            if (idUser) await credentialModel.create(userSail)
            return res.json({
                success: true,
                error: null,
                data: {
                    id: idUser
                }
            });
        })
        .catch(error => {
            return res.json({
                success: false,
                data: null,
                error: error
            });
        });
};

exports.postLogout = (req, res, next) => {
    return res.json({
        success: true,
        error: null,
        data: {
            isSuccess: true
        }
    });
};

exports.postReset = (req, res, next) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });

    UserModel.findOne({ email: email })
        .then(async (user) => {
            if (!user) return res.json({
                success: false,
                data: null,
                error: {}
            });
            bcrypt.hash(passwwordDefault, 12)
                .then(async (hashedPassword) => {
                    userSail.password_hash = hashedPassword;
                    const { id } = user;
                    userSail.user_id = id
                    await credentialModel.delete(id)
                    await credentialModel.create(userSail)
                    return res.json({
                        success: true,
                        error: null,
                        data: {
                            id: user.id.toString()
                        }
                    });
                })
                .catch(error => {
                    return res.json({
                        success: false,
                        data: null,
                        error: error
                    });
                });
        })
        .catch(error => {
            return res.json({
                success: false,
                data: null,
                error: error
            });
        });
};

exports.postNewPassword = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });

    UserModel.findOne({ email: email })
        .then(async (user) => {
            if (!user) return res.json({
                success: false,
                data: null,
                error: {}
            });
            bcrypt.hash(password, 12)
                .then(async (hashedPassword) => {
                    userSail.password_hash = hashedPassword
                    userSail.user_id = user.id
                    await credentialModel.delete(user.id)
                    await credentialModel.create(userSail)
                    return res.json({
                        success: true,
                        error: null,
                        data: {
                            id: user.id.toString()
                        }
                    });
                })
                .catch(error => {
                    return res.json({
                        success: false,
                        data: null,
                        error: error
                    });
                });
        })
        .catch(error => {
            return res.json({
                success: false,
                data: null,
                error: error
            });
        });
};
