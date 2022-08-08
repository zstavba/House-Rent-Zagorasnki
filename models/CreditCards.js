"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database_modules/db"));
const User_1 = __importDefault(require("./User"));
class CreditCards {
    constructor() {
        this.user = new User_1.default();
        this.db = new db_1.default();
        this.setConnection = this.db.setConnection();
        this.get = (userID) => {
            return new Promise((resolve, reject) => {
                var cardQuery = `SELECT * FROM credit_cards WHERE user_id = ${userID}`;
                this.setConnection.query(cardQuery, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(JSON.parse(JSON.stringify(rows[0])));
                });
            });
        };
        this.create = (userID, params) => {
            return new Promise((resolve, reject) => {
                var cardQuery = `INSERT INTO credit_cards (user_id, card_number, card_cvc, card_country, card_home_adress, card_experation_date) VALUES(${userID},'${params.card_number}', '${params.card_cvc}', '${params.card_country}', '${params.card_home_adress}', '${params.card_experation_date}') `;
                this.setConnection.query(cardQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                    return resolve({ saved: true, message: "OK" });
                });
            });
        };
        this.update = () => {
        };
        this.delete = () => {
        };
    }
}
exports.default = CreditCards;
