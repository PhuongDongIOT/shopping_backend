const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class ReviewModel {
    tableReviews = 'reviews';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableReviews}`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${this.tableReviews}
        WHERE ${columnSet}`;
        const result = await query  (sql, [...values]);
        return result[0];
    }

    create = async ({ user_id, category_id = null, product_id = null, order_id = null, rating = null, comment }) => {
        const sqlReview = `INSERT INTO ${this.tableReviews}
        (id, user_id, category_id, rating, product_id, comment) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const reviewId = uuidv4()
            await query(sqlReview, [reviewId, user_id, category_id, product_id, rating, comment]);
            return reviewId;
        } catch (error) {
            return null;
        }
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableReviews}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new ReviewModel;
