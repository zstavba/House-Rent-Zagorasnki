"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database_modules/db"));
class Booking {
    constructor() {
        this.database = new db_1.default();
        this.setConnection = this.database.setConnection();
        this.get = () => {
            return new Promise((resolve, reject) => {
                var getQuery = "SELECT * FROM apartments";
                this.setConnection.query(getQuery, (error, rows, field) => {
                    if (error)
                        return reject(error);
                    return resolve(rows);
                });
            });
        };
        this.getByID = (bookingID) => {
            return new Promise((resolve, reject) => {
                var getQuery = `SELECT * FROM apartments WHERE id = ${bookingID}`;
                this.setConnection.query(getQuery, (error, rows, fields) => {
                    if (error)
                        return reject(error);
                    return resolve(rows[0]);
                });
            });
        };
        this.create = (userID, albumID, params) => {
            return new Promise((resolve, reject) => {
                var apartment_bedroom_types = {
                    apartment_livingroom_choutch: params.apartment_livingroom_choutch,
                    apartment_marriage: params.apartment_marriage,
                    apartment_marriage_big: params.apartment_marriage_big,
                    apartment_one_bed: params.apartment_one_bed
                };
                let apartment_invalid_people = JSON.parse(params.apartment_invalid_people);
                let apartment_wifi = JSON.parse(params.apartment_wifi);
                let apartment_house_pets = JSON.parse(params.apartment_house_pets);
                let parking_spot = JSON.parse(params.parking_spot);
                var bookingQuery = `INSERT INTO apartments (user_id,album_id,apartment_title,apartment_full_adress,apartment_bedroom_types,apartment_parking_spot,apartment_house_pets,apartment_wifi,apartment_price,apartment_invalid_people,apartment_living_room_description,apartment_bathroom_description,apartment_outerspace_description,apartment_kitchen_descritpion,apartment_advanced_description) VALUES(${userID},${albumID},'${params.apartment_title}','${params.apartment_full_adress}','${JSON.stringify(apartment_bedroom_types)}',${parking_spot.approved},'${apartment_house_pets.approved}','${apartment_wifi.approved}','${params.apartment_price}','${apartment_invalid_people.approved}',${this.setConnection.escape(params.apartment_living_room_description)},${this.setConnection.escape(params.apartment_bathroom_description)},${this.setConnection.escape(params.apartment_outerspace_description)},${this.setConnection.escape(params.apartment_kitchen_descritpion)},${this.setConnection.escape(params.apartment_advanced_description)})`;
                this.setConnection.query(bookingQuery, (error, rows, fields) => {
                    if (error)
                        return reject({ saved: false, message: error });
                    return resolve({ saved: true, message: "OK" });
                });
                this.setConnection.end();
            });
        };
    }
}
exports.default = Booking;
