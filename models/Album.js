"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database_modules/db"));
class Album {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.get = (albumID) => {
            return new Promise((resolve, reject) => {
                var sqlAlbum = `SELECT * FROM album WHERE id = '${albumID}'`;
                this.setConnection.query(sqlAlbum, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
            });
        };
        this.create = (params) => {
            return new Promise((resolve, reject) => {
                var sqlQuery = `INSERT INTO album (user_id,album_name,album_type) VALUES(${params.user_id},'${params.album_name}', '${params.album_tpye}')`;
                this.setConnection.query(sqlQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                    return resolve({ saved: true, message: rows.insertId });
                });
            });
        };
        this.delete = (albumID) => {
            return new Promise((resolve, reject) => {
                var sqlDelete = `DELETE FROM album WHERE id = ${albumID}`;
                this.setConnection.query(sqlDelete, (error, rows, fields) => {
                    if (error)
                        return reject({ deleted: false, message: error });
                    return resolve({ deleted: true, message: "OK" });
                });
            });
        };
    }
}
exports.default = Album;
