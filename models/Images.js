"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database_modules/db"));
class Images {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.get = (albumID) => {
            return new Promise((resolve, reject) => {
                var imagesSql = `SELECT * FROM images WHERE album_id = '${albumID}'`;
                this.setConnection.query(imagesSql, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
            });
        };
        this.create = (params) => {
            return new Promise((resolve, reject) => {
                var imagesQuery = `INSERT INTO images (album_id, image_name) VALUES(${params.album_id}, '${params.image_name}')`;
                this.setConnection.query(imagesQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                    return resolve({ saved: true, message: "OK" });
                });
            });
        };
        this.delete = (albumID) => {
            return new Promise((resolve, reject) => {
                var sqlDelete = `DELETE FROM images WHERE album_id = ${albumID}`;
                this.setConnection.query(sqlDelete, (error, rows, fields) => {
                    if (error)
                        return reject({ deleted: false, message: error });
                    return resolve({ deleted: true, message: "OK" });
                });
            });
        };
    }
}
exports.default = Images;
