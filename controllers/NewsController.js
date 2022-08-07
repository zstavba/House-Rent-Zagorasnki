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
const User_1 = __importDefault(require("../models/User"));
const Album_1 = __importDefault(require("../models/Album"));
const Images_1 = __importDefault(require("../models/Images"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const News_1 = __importDefault(require("../models/News"));
class NewsController {
    constructor() {
        this.user = new User_1.default();
        this.news = new News_1.default();
        this.home = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user != undefined) {
                let findUser = yield this.user.get(req.session.user.id);
                let news = yield this.news.getForView();
                res.render("dashboard/news", { baseUrl: res.baseUrl, userData: findUser, newsList: news });
            }
            else {
                res.redirect("/");
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let files = req.files;
                if (files.length <= 0)
                    throw new Error("Preden želite ustvariti novice, vas prosimo, da izberete vsaj eno sliko.");
                const createAlbum = new Album_1.default();
                let album = yield createAlbum.create({
                    user_id: req.session.user.id,
                    album_name: data.news_title,
                    album_tpye: "News"
                });
                if (album.saved == false)
                    throw new Error(album.message);
                let title = data.news_title;
                let filePath = __dirname + '/../public/images/' + title.replace(" ", "_");
                if (fs_1.default.existsSync(filePath))
                    throw new Error("Izbrano ime za to novico, že obstaja. Prosimo vas, da izberete drugo !!!");
                let createFolder = fs_1.default.mkdir(filePath, (error) => {
                    if (error)
                        throw new Error(error);
                });
                for (let file of files) {
                    let images = new Images_1.default();
                    let name = path_1.default.basename(file.path);
                    let createImages = images.create({
                        album_id: album.message,
                        image_name: name
                    });
                    fs_1.default.rename(file.path, filePath + "/" + name, (error) => {
                        if (error)
                            throw new Error(error);
                    });
                }
                let news = new News_1.default();
                let createNews = yield news.create({
                    user_id: req.session.user.id,
                    album_id: album.message,
                    news_title: data.news_title,
                    news_type: data.news_type,
                    news_description: data.news_description
                });
                if (createNews.saved == false)
                    throw new Error("Med ustvarjanjem novice je prišlo do napake !!!");
                res.status(200).json({
                    message: "Vaša novica je bila uspešno shranjena !!!"
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let getNews = yield this.news.get();
                if (getNews.length <= 0)
                    throw new Error("Seznam novic je prazen !!!");
                let array = new Array();
                for (let post of getNews) {
                    let user = new User_1.default();
                    let getUser = yield user.get(post.user_id);
                    let album = new Album_1.default();
                    let getAlbum = yield album.get(post.album_id);
                    var data = {
                        title: post.title,
                        type: post.news_type,
                        description: post.description,
                        user: {
                            id: getUser.id,
                            name: `${getUser.first_name} ${getUser.last_name}`,
                            username: getUser.username,
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
                res.status(200).json({
                    "news": array
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.deletePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                var postID = req.params.postID;
                let news = new News_1.default();
                let getSinglePost = yield news.getByID(postID);
                if (getSinglePost == null)
                    throw new Error("Iskana novica žal ne obstaja. Ste prepričani, če je ta novica na seznamu ? ");
                let images = new Images_1.default();
                let deleteImages = yield images.delete(getSinglePost.album_id);
                if (!deleteImages.deleted)
                    throw new Error(deleteImages.message);
                let album = new Album_1.default();
                let deleteAlbum = yield album.delete(getSinglePost.album_id);
                if (!deleteAlbum.deleted)
                    throw new Error(deleteAlbum.message);
                let deleteNews = yield news.delete(postID);
                if (!deleteNews.deleted)
                    throw new Error(deleteNews.message);
                res.status(200).json({
                    message: "Izbrana novica je bila uspešno izbrisana. "
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
exports.default = NewsController;
