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
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailController {
    constructor() {
        this.home = (req, res, next) => {
        };
        this.recive = (req, res, next) => {
            res.render("dashboard/emails/recive");
        };
        this.send = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let testAccount = yield nodemailer_1.default.createTestAccount();
                let transporter = nodemailer_1.default.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "houserentzagoranski@gmail.com",
                        pass: "Zagoranskilaura@123", // generated ethereal password
                    },
                });
                let info = yield transporter.sendMail({
                    from: data.email,
                    to: "houserentzagoranski@gmail.com",
                    subject: data.subject,
                    html: data.mail_text, // html body
                });
                console.log(info);
                res.status(200).json({
                    message: info.messageId
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
exports.default = EmailController;
