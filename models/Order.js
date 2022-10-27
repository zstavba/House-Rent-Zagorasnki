"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database_modules/db"));
class Order {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.get = () => {
            return new Promise((resolve, reject) => {
                var getQuery = `SELECT * FROM orders`;
                this.setConnection.query(getQuery, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
            });
        };
        this.getById = (orderID) => {
            return new Promise((resolve, reject) => {
                var getQuery = `SELECT * FROM orders WHERE id = ${orderID}`;
                this.setConnection.query(getQuery, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows[0]);
                });
            });
        };
        this.getByDate = (params) => {
            return new Promise((resolve, reject) => {
                var getQuery = `SELECT * FROM orders WHERE rent_from = '${params.rent_from}' AND rent_to = '${params.rent_to}'`;
                this.setConnection.query(getQuery, (error, rows, field) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
                //this.setConnection.end();
            });
        };
        this.delete = (orderID) => {
            return new Promise((resolve, reject) => {
                var deleteQuery = `DELETE FROM orders WHERE id = ${orderID}`;
                this.setConnection.query(deleteQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ deleted: false, message: error });
                    return resolve({ deleted: true, message: "OK" });
                });
            });
        };
        this.create = (userID, apartmentID, params) => {
            return new Promise((resolve, reject) => {
                var createQuery = `INSERT INTO orders (user_id,apartment_id,price_amount,rent_adults_number,rent_childs_number,user_message,rent_from,rent_to) VALUES(${userID},${apartmentID},'${params.price_amount}','${params.rent_adults_number}','${params.rent_childs_number}',${this.setConnection.escape(params.user_message)},'${params.rent_from}','${params.rent_to}')`;
                this.setConnection.query(createQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                    return resolve({ saved: true, message: "OK" });
                });
            });
        };
    }
}
exports.default = Order;
