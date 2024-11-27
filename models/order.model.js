const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class OrderModel {
    tableOrder = 'orders';

    find = async (params = {}) => {
        console.log(params);
        
        let sql = `SELECT users.name, users.avatar, orders.address, products.picture, CONVERT(orders.is_deleted, INT) as is_deleted, CONVERT(orders.id, NCHAR) as id, orders.status, products.summary, order_lines.price, order_lines.quantity, products.title, products.sales, orders.date_created as date FROM orders
                    INNER JOIN users ON orders.user_id = users.id
                    LEFT JOIN order_lines ON orders.id = order_lines.order_id
                    LEFT JOIN products ON order_lines.product_id = products.id`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findProduct = async (params = {}) => {
        let sql = `SELECT users.name, users.avatar, orders.address, products.picture, CONVERT(orders.is_deleted, INT) as is_deleted, CONVERT(orders.id, NCHAR) as id, orders.status, products.summary, order_lines.price, order_lines.quantity, products.title, products.sales, orders.date_created as date FROM orders
                    INNER JOIN users ON orders.user_id = users.id
                    LEFT JOIN order_lines ON orders.id = order_lines.order_id
                    LEFT JOIN products ON order_lines.product_id = products.id
                    WHERE orders.status = 1 AND orders.is_deleted = 0`;
        return await query(sql);
    }

    findProductDetroy= async (params = {}) => {
        let sql = `SELECT users.name, users.avatar, orders.address, products.picture, orders.reason as reason,  CONVERT(orders.is_deleted, INT) as is_deleted, CONVERT(orders.id, NCHAR) as id, orders.status, products.summary, order_lines.price, order_lines.quantity, products.title, products.sales FROM orders
                    INNER JOIN users ON orders.user_id = users.id
                    LEFT JOIN order_lines ON orders.id = order_lines.order_id
                    LEFT JOIN products ON order_lines.product_id = products.id
                    WHERE orders.status = 1 AND orders.is_deleted = 1`;
        return await query(sql);
    }

    findProductReview= async (params = {}) => {
        let sql = `SELECT users.name, users.avatar, orders.address, products.picture, orders.review as review,  CONVERT(orders.is_deleted, INT) as is_deleted, CONVERT(orders.id, NCHAR) as id, orders.status, products.summary, order_lines.price, order_lines.quantity, products.title, products.sales FROM orders
                    INNER JOIN users ON orders.user_id = users.id
                    LEFT JOIN order_lines ON orders.id = order_lines.order_id
                    LEFT JOIN products ON order_lines.product_id = products.id
                    WHERE orders.status = 1 AND orders.is_deleted = 0 AND orders.review is not null`;
        return await query(sql);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${this.tableOrder}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ user_id, address = "" }) => {
        const sqlOrder = `INSERT INTO ${this.tableOrder}
        (id, user_id, is_deleted,status, address) VALUES (?, ?, ?, ?, ?)`;
        try {
            const oderId = uuidv4();
            await query(sqlOrder, [oderId, user_id, 0, 1, address]);
            return oderId;
        } catch (error) {
            return null;
        }
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE ${this.tableOrder} SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async ({id, message}) => {
        const sql = `UPDATE ${this.tableOrder} SET is_deleted = 1, reason = ?
        WHERE id = ?`;
        const result = await query(sql, [message, id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new OrderModel;
