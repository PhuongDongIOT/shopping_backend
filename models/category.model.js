const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class CategoryModel {
    tableCategory = 'categories';

    find = async (params = {}) => {
        let sql = `SELECT CONVERT(categories.id, NCHAR) id, CONVERT(categories.parent_category, NCHAR) parent_category, slug, name, description FROM ${this.tableCategory}`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${this.tableCategory}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ parent_category = null, slug = null, name, description = null }) => {
        const sqlCategory = `INSERT INTO ${this.tableCategory}
        (id, parent_category, slug, name, description) VALUES (?, ?, ?, ?, ?)`;
        try {
            const idCategory = uuidv4();
            await query(sqlCategory, [idCategory, parent_category, slug, name, description]);
            return idCategory;
        } catch (error) {
            console.log(error);
            
            return null
        }
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableCategory}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new CategoryModel;
