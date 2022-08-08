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
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const CreditCards_1 = __importDefault(require("../models/CreditCards"));
const User_1 = __importDefault(require("../models/User"));
class DashboardController {
    constructor() {
        this.user = new User_1.default();
        this.creditCard = new CreditCards_1.default();
        this.home = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user != undefined) {
                let findUser = yield this.user.get(req.session.user.id);
                res.render("dashboard/home", { baseUrl: res.baseUrl, userData: findUser });
            }
            else {
                res.redirect("/");
            }
        });
        this.userSettings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user != undefined) {
                let findUser = yield this.user.get(req.session.user.id);
                let getCard = yield this.creditCard.get(req.session.user.id);
                res.render("dashboard/userSettings", { baseUrl: res.baseUrl, userData: findUser, card: getCard });
            }
            else {
                res.redirect("/");
            }
        });
        this.updateProfilePicture = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.session.user == undefined)
                    throw new Error("Vaša seja je potekla prosimo vas, da se ponovno prijative v sistem");
                let userId = req.session.user.id;
                let file = req.file;
                let name = (0, path_1.basename)(file.path);
                let userObject = yield this.user.get(userId);
                let userPath = __dirname + `/../public/images/users/${userObject.username}`;
                if (fs_1.default.existsSync(userPath) == false) {
                    this.createFolder(userPath);
                    this.uploadFolder(file.path, userPath + "/" + name);
                }
                else {
                    this.uploadFolder(file.path, userPath + "/" + name);
                }
                let update = yield this.user.updateProfile(userId, `/public/images/users/${userObject.username}/${name}`);
                if (!update.updated)
                    throw new Error(update.message);
                res.status(200).json({
                    "message": "Posodobitev profilne slike je bila uspešna. "
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.uploadFolder = (filePath, fileName) => {
            fs_1.default.rename(filePath, fileName, (error) => {
                if (error)
                    throw new Error(error);
            });
        };
        this.createFolder = (filePath) => {
            fs_1.default.mkdir(filePath, { recursive: true }, (error) => {
                if (error)
                    throw new Error(error);
            });
        };
        this.updateBasicInformation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.session.user == undefined)
                    throw new Error("Vaša seja je potekla, prosimo vas, da se ponovno prijavite v sistem !!!");
                let data = req.body;
                let userID = req.session.user.id;
                let getUser = yield this.user.get(userID);
                Object.values(data).every((dataValue, index) => __awaiter(this, void 0, void 0, function* () {
                    if (dataValue !== Object.values(getUser)[index]) {
                        let updateInfo = yield this.user.updateInfo(userID, {
                            key: Object.keys(data)[index],
                            value: dataValue
                        });
                    }
                }));
                res.status(200).json({
                    message: "Vaši podatki so bili uspešno posodobljeni."
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.createCard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.session.user == undefined)
                    throw new Error("Vaša seja je potekla, prosimo vas, da se ponovno prijavite !");
                var userID = req.session.user.id;
                var data = req.body;
                let createCard = yield this.creditCard.create(userID, data);
                if (createCard.saved == false)
                    throw new Error(createCard.message);
                res.status(200).json({
                    message: "Vaša kreditna kartica je bila uspešno shranjena !"
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
    }
}
exports.default = DashboardController;
