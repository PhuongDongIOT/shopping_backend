const { v4: uuidv4 } = require('uuid');
const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');

class UserModel {
    tableUser = 'users';
    tableCredentials = 'credentials';

    find = async (params = {}) => {
        let sql = `SELECT id, email, name, avatar, address, phoneNumber, role FROM ${this.tableUser}`;
        if (!Object.keys(params).length) return await query(sql);
        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;
        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `SELECT id, email, name, avatar, address, phoneNumber, role FROM ${this.tableUser}
        WHERE ${columnSet}`;
        const result = await query(sql, [...values]);
        return result[0];
    }

    create = async ({ slug = null, email = null, name = null, avatar = null, bio = null, company = null, role = 'user', phoneNumber = null, address = null }) => {
        const sqlUser = `INSERT INTO ${this.tableUser}
        (id, slug, email, name, avatar, bio, company, is_active, is_deleted, role, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const idUser = uuidv4();
            await query(sqlUser, [idUser, slug, email, name, avatar, bio, company, 1, 0, role, phoneNumber, address]);
            return idUser;
        } catch (error) { console.log(error); }
        return null;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)
        const sql = `UPDATE user SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);
        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableUser}
        WHERE id = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        return affectedRows;
    }
}

module.exports = new UserModel;
