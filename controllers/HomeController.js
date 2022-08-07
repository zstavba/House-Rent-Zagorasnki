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
const bcrypt_1 = __importDefault(require("bcrypt"));
class HomeController {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.home = (req, res, next) => {
            if (req.session.user != undefined) {
                if (req.session.user.isLoggedIn)
                    res.redirect("dashboard");
                res.redirect("index");
            }
            else {
                res.render("index");
            }
        };
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.setConnection.connect();
                var requestData = req.body;
                var query = `SELECT * FROM users WHERE username = '${requestData.email}'`;
                var data = yield new Promise((resolve, reject) => {
                    return this.setConnection.query(query, (error, result) => {
                        if (error)
                            reject(error);
                        return resolve(JSON.parse(JSON.stringify(result[0])));
                    });
                });
                let User = data;
                const checkPassword = yield bcrypt_1.default.compare(requestData.password, User.password);
                if (checkPassword) {
                    let userSession = req.session.user = {
                        "id": User.id,
                        "isLoggedIn": true
                    };
                    req.session.save();
                    res.status(200).json({
                        "message": "Prijava je bila uspešna"
                    });
                }
                else {
                    throw new Error("Iskani uporabnik ni bil najden. Ali pa ste vpisali napačno geslo !");
                }
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
    }
}
exports.default = HomeController;
