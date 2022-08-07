"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
class DB {
    constructor() {
        this.setConnection = () => {
            let connection = mysql_1.default.createConnection({
                "host": "localhost",
                "user": "root",
                "password": "",
                "database": "booking",
                multipleStatements: true
            });
            return connection;
        };
    }
}
exports.default = DB;
