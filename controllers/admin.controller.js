// const fileHelper = require('../util/file');
const { validationResult } = require('express-validator/check');
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');
const BannerModel = require('../models/banner.model');
const HelperModel = require('../models/helper.model');

exports.getBanner = (req, res, next) => {
    BannerModel.find({})
        .then(async (result) => {
            let objBanner = [];
            if (result) objBanner = Object.values(result);
            objBanner = HelperModel.convertLinkStatic(objBanner, "picture");
            return res.json({
                success: true,
                error: null,
                data: {
                    banners: objBanner
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


exports.postBanner = (req, res, next) => {
    const { title } = req.body;
    const image = req.file;
    const imageUrl = image?.path ?? null;
    BannerModel.create({ picture: imageUrl, title })
        .then(async (idBanner) => {
            return res.json({
                success: true,
                error: null,
                data: {
                    id: idBanner
                }
            });
        })
        .catch(error => {
            return res.json({
                success: false,
                data: null,
                error: error,
            });
        });
};

exports.postAddCategory = (req, res, next) => {
    const { parent_category, slug, name, description } = req.body;
    const image = req.file;
    const imageUrl = image?.path ?? null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });
    CategoryModel.create({
        parent_category, slug, name, description, picture: imageUrl
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
            objCategory = HelperModel.convertLinkStatic(objCategory, "picture");
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
    const { title } = req.query;
    ProductModel.find(title).then(result => {
        let objProduct = [];
        try {
            if (result) objProduct = Object.values(result);
            objProduct = HelperModel.convertLinkStatic(objProduct, "picture");
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

exports.getListSaleProduct = (req, res, next) => {
    ProductModel.findSale().then(result => {
        let objProduct = [];
        try {
            if (result) objProduct = Object.values(result)
            objProduct = HelperModel.convertLinkStatic(objProduct, "picture");
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
    const { category_id, title, slug, summary, description, price, created_by, sales = 0 } = req.body;
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
        created_by,
        sales
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