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
require("reflect-metadata");
const geocoder_1 = require("@goparrot/geocoder");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Geo = require('geo-nearby');
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const User_1 = __importDefault(require("../models/User"));
const Album_1 = __importDefault(require("../models/Album"));
const Images_1 = __importDefault(require("../models/Images"));
const Booking_1 = __importDefault(require("../models/Booking"));
class BookingCotnroller {
    constructor() {
        this.user = new User_1.default();
        this.album = new Album_1.default();
        this.images = new Images_1.default();
        this.booking = new Booking_1.default();
        this.home = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user != undefined) {
                let findUser = yield this.user.get(req.session.user.id);
                let bookingList = yield this.getFullListBooking();
                res.render("dashboard/booking", { baseUrl: res.baseUrl, userData: findUser, bookings: bookingList });
            }
            else {
                res.redirect("/");
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.session.user == undefined)
                    throw new Error("Vaša seja je potekla. Prosimo vas, da se ponovno prijavite.");
                let userID = req.session.user.id;
                let data = req.body;
                let files = req.files;
                if (files.length <= 0)
                    throw new Error("Seznam slik je trenutno prazen. Za ustvarjanje oglasa, izberite vsaj eno sliko !!!");
                let createAlbum = yield this.album.create({
                    user_id: userID,
                    album_name: data.apartment_title,
                    album_type: "Apratment"
                });
                if (createAlbum.saved == false)
                    throw new Error(createAlbum.message);
                let filePath = `${__dirname}/../public/images/apartments/${data.apartment_title}`;
                if (fs_1.default.existsSync(filePath))
                    throw new Error(`Booking pod tem imenom {${data.apartment_title}} že obstaja. Prosimo vas, da izberete drugo ime za nov apartma !`);
                fs_1.default.mkdir(filePath, (error) => {
                    if (error)
                        throw new Error(error);
                });
                for (let file of files) {
                    let images = new Images_1.default();
                    let name = path_1.default.basename(file.path);
                    yield images.create({
                        album_id: createAlbum.message,
                        image_name: name
                    });
                    fs_1.default.rename(file.path, `${filePath}/${name}`, (error) => {
                        if (error)
                            throw new Error(error);
                    });
                }
                let createBooking = yield this.booking.create(userID, createAlbum.message, data);
                if (createBooking.saved == false)
                    throw new Error(createBooking.message);
                res.status(200).json({
                    message: "Vaš oglas je bil uspešno shranjen."
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.getLocationPlaces = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const Axios = axios_1.default.create();
                const provider = new geocoder_1.GoogleMapsProvider(axios_1.default, 'AIzaSyAC-f4nUCWaDAmCJJzX2wOQ003bDhDHJ_M');
                const geocoder = new geocoder_1.Geocoder(provider);
                const client = new google_maps_services_js_1.Client({});
                const placeAddress = req.params;
                const location = yield geocoder.geocode({
                    address: `${placeAddress.adress}`,
                });
                let getLocation = yield Axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAC-f4nUCWaDAmCJJzX2wOQ003bDhDHJ_M&location=${location[0].latitude},${location[0].longitude}&radius=9000&type=['restaurant','spas']`).then((params) => {
                    return params.data;
                });
                return res.status(200).json({
                    priporocila: getLocation
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.getList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let getList = yield this.getFullListBooking();
                res.status(200).json({
                    "data": getList
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.getFullListBooking = () => __awaiter(this, void 0, void 0, function* () {
            let getBookings = yield this.booking.get();
            let array = new Array();
            for (let booking of getBookings) {
                var data = booking;
                let getUser = yield this.user.get(booking.user_id);
                data.user = {
                    id: getUser.id,
                    name: `${getUser.first_name} ${getUser.last_name}`,
                    profile: (getUser.profile_image == null) ? '' : getUser.profile_image
                };
                let getImages = yield this.images.get(booking.album_id);
                data.cover_image = `/images/apartments/${booking.apartment_title}/${getImages[0].image_name}`;
                array.push(data);
            }
            return array;
        });
        this.getBookingInformation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let bookingID = req.params.bookingID;
                let getInfo = yield this.booking.getByID(bookingID);
                if (getInfo.length <= 0)
                    throw new Error("Iskan apartma ni na voljo, ali je dokončno izbrisani, ali je trenutno neaktiven !");
                let getImages = yield this.images.get(getInfo.album_id);
                if (getImages.length <= 0)
                    throw new Error("Iskan apartma, nima na voljo za prikaz slik. Morda je prišlo do napake. Ali pa je apartma izbrisan iz seznama !");
                getInfo.images = new Array();
                for (let image of getImages) {
                    var data = `/images/apartments/${getInfo.apartment_title}/${image.image_name}`;
                    getInfo.images.push(data);
                }
                res.status(200).json({
                    info: getInfo
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
exports.default = BookingCotnroller;
