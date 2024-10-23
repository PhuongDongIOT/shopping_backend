const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class ProductModel {
    tableProductName = 'products';

    find = async (params = {}) => {
        let sql = `SELECT CONVERT(products.id, NCHAR) id, CONVERT(products.category_id, NCHAR) category_id, title, slug, picture, summary, description, price, created_by FROM ${this.tableProductName}`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT CONVERT(products.id, NCHAR) id, CONVERT(products.category_id, NCHAR) category_id, title, slug, picture, summary, description, price, created_by FROM ${this.tableProductName}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ category_id = null, title, slug = null, picture = null, summary = null, description = null, price = 0, created_by = null }) => {
        const sql = `INSERT INTO ${this.tableProductName}
        (id, category_id, title, slug, picture, summary, description, price, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        try {
            const idProduct = uuidv4();
            await query(sql, [idProduct, category_id, title, slug, picture, summary, description, price, created_by]);
            return idProduct;
        } catch (error) {
            return null
        }
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params);
        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableProductName}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new ProductModel;
