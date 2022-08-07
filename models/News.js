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
const User_1 = __importDefault(require("./User"));
const Images_1 = __importDefault(require("./Images"));
class News {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.get = () => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var query = `SELECT * FROM news`;
                this.setConnection.query(query, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
            }));
        };
        this.getByID = (newsID) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var query = `SELECT * FROM news WHERE id = ${newsID}`;
                this.setConnection.query(query, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(JSON.parse(JSON.stringify(rows[0])));
                });
            }));
        };
        this.create = (params) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var query = `INSERT INTO news (user_id,album_id,title,news_type,description) VALUES(${params.user_id},${params.album_id}, '${params.news_title}', '${params.news_type}', ${this.setConnection.escape(params.news_description)})`;
                this.setConnection.query(query, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                });
            });
        });
        this.getForView = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let array = new Array();
                let news = yield this.get();
                if (news.length <= 0)
                    throw new Error("Seznam novic je prazen !!!");
                for (let post of news) {
                    let user = new User_1.default();
                    let getUser = yield user.get(post.user_id);
                    let data = {
                        id: post.id,
                        titile: post.title,
                        type: post.news_type,
                        text: post.description,
                        user: {
                            id: getUser.id,
                            name: `${getUser.first_name} ${getUser.last_name}`,
                            profile: (getUser.profile == null) ? 'https://i0.wp.com/newspack-washingtoncitypaper.s3.amazonaws.com/uploads/2009/04/contexts.org_socimages_files_2009_04_d_silhouette.png?fit=1200%2C756&ssl=1' : getUser.profile
                        },
                        images: []
                    };
                    let images = new Images_1.default();
                    let getImages = yield images.get(post.album_id);
                    for (let image of getImages) {
                        const imageUrl = `/images/${post.title.replace(" ", "_")}/${image.image_name}`;
                        data.images.push(imageUrl);
                    }
                    array.push(data);
                }
                return array;
            }
            catch (error) {
                return [{
                        message: error.message
                    }];
            }
        });
        this.delete = (postID) => {
            return new Promise((resolve, reject) => {
                var sqlDelete = `DELETE FROM news WHERE id = ${postID}`;
                this.setConnection.query(sqlDelete, (error, rows, fields) => {
                    if (error)
                        return reject({ deleted: false, message: error });
                    return resolve({ deleted: true, message: "OK" });
                });
            });
        };
    }
}
exports.default = News;
