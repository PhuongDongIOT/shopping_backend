// const fileHelper = require('../util/file');
const { validationResult } = require('express-validator/check');
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');

exports.postAddCategory = (req, res, next) => {
    const { parent_category, slug, name, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });
    CategoryModel.create({
        parent_category, slug, name, description
    }).then(async (idCategory) => {
        return res.json({
            success: true,
            error: null,
            data: {
                id: idCategory
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    })
};

exports.postDeleteCategory = (req, res, next) => {
    const { id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });
    CategoryModel.delete({
        id
    }).then(async (idCategory) => {
        return res.json({
            success: true,
            error: null,
            data: {
                isSuccedd: true
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    })
};

exports.postDeleteCategory = (req, res, next) => {
    const { id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });
    CategoryModel.delete({
        id
    }).then(async (idCategory) => {
        return res.json({
            success: true,
            error: null,
            data: {
                isSuccedd: true
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    })
};

exports.getListCategory = (req, res, next) => {
    CategoryModel.find().then(result => {
        let objCategory = [];
        try {
            if (result) objCategory = Object.values(result)
        } catch (error) { }
        return res.json({
            success: true,
            error: null,
            data: {
                category: objCategory
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    })
};   

exports.getListProduct = (req, res, next) => {
    ProductModel.find().then(result => {
        let objProduct = [];
        try {
            if (result) objProduct = Object.values(result)
        } catch (error) { }
        return res.json({
            success: true,
            error: null,
            data: {
                product: objProduct
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    ProductModel.findOne({ id: productId }).then(result => {
        return res.json({
            success: true,
            error: null,
            data: {
                ...result
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    });
};


exports.postAddProduct = (req, res, next) => {
    const { category_id, title, slug, summary, description, price, created_by } = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });
    const imageUrl = image?.path ?? null;
    ProductModel.create({
        category_id,
        title,
        slug,
        picture: imageUrl,
        summary,
        description,
        price,
        created_by
    }).then(result => {
        return res.json({
            success: true,
            error: null,
            data: {
                id: result
            }
        });
    }).catch(error => {
        return res.json({
            success: true,
            data: null,
            error: error
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const { id, category_id, title, slug, summary, description, price, created_by, image } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty() || id) return res.json({
        err: errors
    });
    const imageUrl = image?.path ?? null;
    ProductModel.update({
        category_id,
        title,
        slug,
        picture: imageUrl,
        summary,
        description,
        price,
        created_by
    }, id).then(result => {
        return res.json({
            success: true,
            error: null,
            data: {
                id: result
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    });
};

exports.deleteProduct = (req, res, next) => {
    const { productId } = req.params;
    ProductModel.delete(productId).then(result => {
        return res.json({
            success: true,
            error: null,
            data: {
                isSuccedd: true
            }
        });
    }).catch(error => {
        return res.json({
            success: false,
            data: null,
            error: error
        });
    });
};