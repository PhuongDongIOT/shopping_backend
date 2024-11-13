const { validationResult } = require('express-validator/check');
const ProductModel = require('../models/product.model');
const CartModel = require('../models/cart.model');
const CartItemModel = require('../models/cart-item.model');
const OrderModel = require('../models/order.model');
const OrderLineModel = require('../models/order-line.model');
const ReviewModel = require('../models/review.model');
const { checkEmptyArray } = require('../utils/array.utils');
const helperModel = require('../models/helper.model');

exports.getCart = (req, res, next) => {
    const { cartId } = req.params;
    CartItemModel.find({ cart_id: cartId })
        .then(async (listProduct) => {
            return res.json({
                success: true,
                error: null,
                data: {
                    cart_id: cartId,
                    products: listProduct
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


exports.postCart = (req, res, next) => {
    const { id } = req.currentUser;
    const { products } = req.body;

    CartModel.create({ created_by: id, status: 1 })
        .then(async (idCart) => {
            if (checkEmptyArray(products)) {
                for (item of products) {

                    const { product_id, quantity } = item;
                    const product = await ProductModel.findOne({ id: product_id })
                    await CartItemModel.create({
                        cart_id: idCart.toString(),
                        product_id,
                        quantity: quantity,
                        price: product.price
                    })
                }
            }
            return res.json({
                success: true,
                error: null,
                data: {
                    id: idCart
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

exports.updateCart = (req, res, next) => {
    const { products, cart_id } = req.body;

    CartItemModel.delete(cart_id)
        .then(async () => {
            if (checkEmptyArray(products)) {
                for (item of products) {
                    const { product_id } = item;
                    const product = await ProductModel.findOne({ id: product_id })
                    await CartItemModel.create({
                        cart_id: cart_id,
                        product_id,
                        quantity: 1,
                        price: product.price
                    })
                }
            }
            return res.json({
                success: true,
                error: null,
                data: {
                    id: idCart
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

exports.deleteCart = (req, res, next) => {
    const { cart_id } = req.body;

    CartModel.delete(cart_id)
        .then(async () => {
            return res.json({
                success: true,
                error: null,
                data: {
                    isSuccedd: true
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

exports.postCartDeleteProduct = (req, res, next) => {
    const { cart_id, product_id } = req.body;

    CartItemModel.delete({
        cart_id,
        product_id
    }).then(result => {
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

exports.postOrder = async (req, res, next) => {
    // const { id } = req.currentUser;
    const { products, user_id, address } = req.body;

    const oderId = await OrderModel.create({ user_id, address })
    console.log(oderId);

    if (checkEmptyArray(products)) {
        for (item of products) {
            const { product_id, quantity } = item;
            const product = await ProductModel.findOne({ id: product_id })
            await OrderLineModel.create({
                cart_id: oderId,
                product_id,
                quantity: quantity,
                price: product?.price ?? 0
            })
        }
    }
    return res.json({
        success: true,
        error: null,
        data: {
            id: oderId
        }
    });
};

exports.deleteOrder = (req, res, next) => {
    const { order_id, reason } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });

    OrderModel.delete({
        id: order_id,
        message: reason
    }).then(result => {
        return res.json({
            success: true,
            error: null,
            data: {
                id: order_id
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

exports.getListOrders = (req, res, next) => {
    const { user_id } = req.query;
    OrderModel.find({ user_id: user_id })
        .then(async (listOrder) => {
            const listFilterOder = [];
            listOrder.forEach(element => {
                const isCheck = listFilterOder.findIndex(el => element.id === el.id);
                const { price, quantity, title, sales, picture } = element;
                delete element.price;
                delete element.quantity;
                delete element.title;
                delete element.sales;
                delete element.picture;
                let newObj = { price, quantity, title, sales, picture };
                newObj = helperModel.convertLinkStaticObj(newObj, "picture");
                if (title) {
                    if (isCheck !== 0 || !isCheck) {
                        element.products = [
                            newObj
                        ]
                        listFilterOder.push(element);
                    }
                    else {
                        listFilterOder[isCheck].products.push(newObj);
                    }
                }

            });
            return res.json({
                success: true,
                error: null,
                data: {
                    list: listFilterOder
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

exports.getListAllOrdersDetroy = (req, res, next) => {
    OrderModel.findProductDetroy()
        .then(async (listOrder) => {
            const listFilterOder = [];
            listOrder.forEach(element => {
                const isCheck = listFilterOder.findIndex(el => element.id === el.id);
                element = helperModel.convertLinkStaticObj(element, "picture");
                const { price, quantity, title, sales, picture } = element;
                delete element.price;
                delete element.quantity;
                delete element.title;
                delete element.sales;
                delete element.picture;
                const newObj = { price, quantity, title, sales, picture };
                if (isCheck !== 0 || !isCheck) {
                    element.prices_order = parseInt(price ?? 0);
                    element.sales_order = parseInt(sales ?? 0);
                    element.products = [
                        newObj
                    ]
                    listFilterOder.push(element);
                }
                else {
                    listFilterOder[isCheck].prices_order = (parseInt(listFilterOder[isCheck].prices_order) ?? 0) + parseInt(price ?? 0);
                    listFilterOder[isCheck].sales_order = (parseInt(listFilterOder[isCheck].sales_order) ?? 0) + parseInt(sales ?? 0);
                    listFilterOder[isCheck].products.push(newObj);
                }

            });
            return res.json({
                success: true,
                error: null,
                data: {
                    list: listFilterOder
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

exports.getListAllOrdersReview = (req, res, next) => {
    OrderModel.findProductReview()
        .then(async (listOrder) => {
            const listFilterOder = [];
            listOrder.forEach(element => {
                const isCheck = listFilterOder.findIndex(el => element.id === el.id);
                element = helperModel.convertLinkStaticObj(element, "picture");
                const { price, quantity, title, sales, picture } = element;
                delete element.price;
                delete element.quantity;
                delete element.title;
                delete element.sales;
                delete element.picture;
                const newObj = { price, quantity, title, sales, picture };
                if (isCheck !== 0 || !isCheck) {
                    element.prices_order = parseInt(price ?? 0);
                    element.sales_order = parseInt(sales ?? 0);
                    element.products = [
                        newObj
                    ]
                    listFilterOder.push(element);
                }
                else {
                    listFilterOder[isCheck].prices_order = (parseInt(listFilterOder[isCheck].prices_order) ?? 0) + parseInt(price ?? 0);
                    listFilterOder[isCheck].sales_order = (parseInt(listFilterOder[isCheck].sales_order) ?? 0) + parseInt(sales ?? 0);
                    listFilterOder[isCheck].products.push(newObj);
                }

            });
            return res.json({
                success: true,
                error: null,
                data: {
                    list: listFilterOder
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

exports.getListAllOrders = (req, res, next) => {
    OrderModel.findProduct()
        .then(async (listOrder) => {
            const listFilterOder = [];
            listOrder.forEach(element => {
                const isCheck = listFilterOder.findIndex(el => element.id === el.id);
                element = helperModel.convertLinkStaticObj(element, "picture");
                const { price, quantity, title, sales, picture } = element;
                delete element.price;
                delete element.quantity;
                delete element.title;
                delete element.sales;
                delete element.picture;
                const newObj = { price, quantity, title, sales, picture };
                if (isCheck !== 0 || !isCheck) {
                    element.prices_order = parseInt(price ?? 0);
                    element.sales_order = parseInt(sales ?? 0);
                    element.products = [
                        newObj
                    ]
                    listFilterOder.push(element);
                }
                else {
                    listFilterOder[isCheck].prices_order = (parseInt(listFilterOder[isCheck].prices_order) ?? 0) + parseInt(price ?? 0);
                    listFilterOder[isCheck].sales_order = (parseInt(listFilterOder[isCheck].sales_order) ?? 0) + parseInt(sales ?? 0);
                    listFilterOder[isCheck].products.push(newObj);
                }

            });
            return res.json({
                success: true,
                error: null,
                data: {
                    list: listFilterOder
                }
            });
        })
        .catch(error => {
            console.log(error);

            return res.json({
                success: false,
                data: null,
                error: error
            });
        });
};

exports.postReviewOrder = (req, res, next) => {
    const { order_id, review } = req.body;
    OrderModel.update({
        review
    }, order_id)
        .then(async () => {
            return res.json({
                success: true,
                error: null,
                data: {
                    id: order_id
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

exports.updateOrder = (req, res, next) => {
    const { order_id } = req.body;
    OrderModel.update({
        status: 0
    }, order_id)
        .then(async () => {
            return res.json({
                success: true,
                error: null,
                data: {
                    id: order_id
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


exports.getOrders = (req, res, next) => {
    const { orderId } = req.params;
    OrderLineModel.find({ order_id: orderId })
        .then(async (listProduct) => {
            return res.json({
                success: true,
                error: null,
                data: {
                    order_id: orderId,
                    products: listProduct
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

exports.postReview = (req, res, next) => {
    const { id } = req.currentUser;
    const { category_id, product_id, rating, comment } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({
        success: false,
        data: null,
        error: errors
    });

    ReviewModel.create({ user_id: id, category_id, product_id, rating, comment })
        .then(async (idReview) => {
            return res.json({
                success: true,
                error: null,
                data: {
                    id: idReview
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
