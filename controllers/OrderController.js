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
const User_1 = __importDefault(require("../models/User"));
const Album_1 = __importDefault(require("../models/Album"));
const Images_1 = __importDefault(require("../models/Images"));
const Booking_1 = __importDefault(require("../models/Booking"));
const Order_1 = __importDefault(require("../models/Order"));
class OrderController {
    constructor() {
        this.user = new User_1.default();
        this.album = new Album_1.default();
        this.images = new Images_1.default();
        this.booking = new Booking_1.default();
        this.order = new Order_1.default();
        this.home = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user != undefined) {
                let findUser = yield this.user.get(req.session.user.id);
                let getOrders = yield this.getList();
                res.render("dashboard/orders", { baseUrl: res.baseUrl, userData: findUser, orders: getOrders });
            }
            else {
                res.redirect("/");
            }
        });
        this.homeView = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.session.user != undefined) {
                let findUser = yield this.user.get(req.session.user.id);
                let information = yield this.getInformation(req.params.id);
                if (information.length <= 0) {
                    res.render("dashboard/errors/404");
                }
                else {
                    res.render("dashboard/orderview", { baseUrl: res.baseUrl, userData: findUser, orderInfo: information });
                }
            }
            else {
                res.redirect("/");
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let getUser = yield this.user.getByData(data.rent_email);
                let userID = (getUser.length <= 0) ? null : getUser[0].id;
                if (getUser.length <= 0) {
                    let createUser = yield this.user.create({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        rent_email: data.rent_email,
                        phone_number: data.phone_number,
                        home_address: data.home_address
                    });
                    if (!createUser.saved)
                        throw new Error(createUser.message);
                    userID = createUser.message;
                }
                let createOrder = yield this.order.create(userID, data.apartmentID, data);
                if (createOrder.saved == false)
                    throw new Error(createOrder.message);
                res.status(200).json({
                    message: "Vaše naročilo je bilo uspešno oddano."
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error
                });
            }
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let getOrders = yield this.order.get();
                if (getOrders.length <= 0)
                    throw new Error("Vaš seznam je trenutno prazen.");
                let list = new Array();
                for (let order_item of getOrders) {
                    let data = order_item;
                    let getUser = yield this.user.get(order_item.user_id);
                    // Chaneging the datetime format for the angular material datetime picker to show whcih date is taken. 
                    let rentFrom = new Date(order_item.rent_from);
                    let rentFullDesc = rentFrom.toLocaleDateString('en-US').split('T')[0];
                    let rentTo = new Date(order_item.rent_to);
                    let rentToFullDesc = rentTo.toLocaleDateString('en-US').split('T')[0];
                    data.rent_from = rentFullDesc;
                    data.rent_to = rentToFullDesc;
                    data.user = {
                        name: `${getUser.first_name} ${getUser.last_name}`,
                        email: `${getUser.email}`
                    };
                    let getApartment = yield this.booking.getByID(order_item.apartment_id);
                    data.apartment = {
                        name: getApartment.apartment_title
                    };
                    list.push(data);
                }
                res.status(200).json({
                    orders_list: list
                });
            }
            catch (error) {
                res.status(400).json({
                    message: error.message
                });
            }
        });
        this.getList = () => __awaiter(this, void 0, void 0, function* () {
            let getOrders = yield this.order.get();
            let list = new Array();
            for (let order_item of getOrders) {
                let data = order_item;
                let getUser = yield this.user.get(order_item.user_id);
                data.user = {
                    name: `${getUser.first_name} ${getUser.last_name}`,
                    email: `${getUser.email}`
                };
                let getApartment = yield this.booking.getByID(order_item.apartment_id);
                data.apartment = {
                    name: getApartment.apartment_title
                };
                list.push(data);
            }
            return list;
        });
        this.getInformation = (orderID) => __awaiter(this, void 0, void 0, function* () {
            let getInfo = yield this.order.getById(orderID);
            if (getInfo == undefined) {
                return [];
            }
            let getUser = yield this.user.get(getInfo.user_id);
            let getApartment = yield this.booking.getByID(getInfo.apartment_id);
            getInfo.user = {
                name: `${getUser.first_name} ${getUser.last_name}`,
                profile: (getInfo.profile_image == null) ? 'https://i0.wp.com/newspack-washingtoncitypaper.s3.amazonaws.com/uploads/2009/04/contexts.org_socimages_files_2009_04_d_silhouette.png?fit=1200%2C756&ssl=1' : getInfo.profile_image,
                email: getUser.email,
                phone_number: getUser.phone_number,
                home_address: getUser.home_address,
                place: getUser.home_address.split(",")[1]
            };
            getInfo.apartment = {
                name: getApartment.apartment_title
            };
            return getInfo;
        });
        this.getOrderByDate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                var data = req.body;
                let checkDate = yield this.order.get();
                if (checkDate.length <= 0)
                    throw new Error("Vsi termini so za izbran mesec prosti !!!");
                var listOfArray = new Array();
                for (let date of checkDate) {
                    let user = yield this.user.get(date.user_id);
                    var object = {
                        user: {
                            name: `${user.first_name} ${user.last_name}`,
                            profile: user.profile_image
                        },
                        rent_from: date.rent_from,
                        rent_to: date.rent_to
                    };
                    listOfArray.push(object);
                }
                res.status(200).json({
                    information: listOfArray
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
exports.default = OrderController;
