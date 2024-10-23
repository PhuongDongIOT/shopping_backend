
const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class CartModel {
    tableCart = 'carts';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableCart}`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${this.tableCart}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ created_by = null, status = 1 }) => {
        const sqlCart = `INSERT INTO ${this.tableCart}
        (id, created_by, status) VALUES (?, ?, ?)`;
        try {
            const idCart = uuidv4();
            await query(sqlCart, [idCart, created_by, status]);
            return idCart;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE ${this.tableCart} SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE ${this.tableCart} SET ${columnSet}
        WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new CartModel;
