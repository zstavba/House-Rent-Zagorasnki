"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database_modules/db"));
class User {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.get = (userID) => __awaiter(this, void 0, void 0, function* () {
            var query = `SELECT * FROM users WHERE id = '${userID}'`;
            let userData = new Promise((resolve, reject) => {
                this.setConnection.query(query, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(JSON.parse(JSON.stringify(rows[0])));
                });
            });
            return userData;
        });
        this.getByData = (email) => {
            return new Promise((resolve, reject) => {
                var getUser = `SELECT * FROM users WHERE email = '${email}'`;
                this.setConnection.query(getUser, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
            });
        };
        this.updateProfile = (userID, imagePath) => {
            return new Promise((resolve, reject) => {
                var updateQuery = `UPDATE users SET profile_image = '${imagePath}' WHERE id = ${userID}`;
                this.setConnection.query(updateQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ updated: false, message: error });
                    return resolve({ updated: true, message: "OK" });
                });
            });
        };
        this.updateInfo = (userID, params) => {
            return new Promise((resolve, reject) => {
                var updateQuery = `UPDATE users SET ${params.key} = '${params.value}' WHERE id = ${userID}`;
                this.setConnection.query(updateQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ updated: false, message: error });
                    return resolve({ updated: true, message: "OK" });
                });
            });
        };
        this.create = (params) => {
            return new Promise((resolve, reject) => {
                var createQuery = `INSERT INTO users (first_name,last_name,email,phone_number,home_address) VALUES('${params.first_name}','${params.last_name}','${params.rent_email}','${params.phone_number}','${params.home_address}')`;
                this.setConnection.query(createQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                    /* We need the ID for the database later on !  */
                    return resolve({ saved: true, message: rows.insertId });
                });
            });
        };
    }
}
exports.default = User;
