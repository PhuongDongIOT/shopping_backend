
const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class BannerModel {
    tableBanner = 'banners';

    find = async (params = {}) => {
        let sql = `SELECT CONVERT(id, NCHAR) product_id, picture, title FROM ${this.tableBanner}`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT * FROM ${this.tableBanner}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ picture = "", title = "" }) => {        
        const sqlbanner = `INSERT INTO ${this.tableBanner}
        (id, picture, title) VALUES (?, ?, ?)`;
        try {
            const idBanner = uuidv4();
            await query(sqlbanner, [idBanner, picture, title]);
            return idBanner;
        } catch (error) {
            console.log(error);
            
            return null;
        }
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE ${this.tableBanner} SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE ${this.tableBanner} SET ${columnSet}
        WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new BannerModel;
