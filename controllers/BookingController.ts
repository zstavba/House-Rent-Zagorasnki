import 'reflect-metadata';
import { Distance, Location, Geocoder, GoogleMapsProvider, Suggestion, TravelModeEnum } from '@goparrot/geocoder';
import axios, { AxiosInstance } from 'axios';
import fs from "fs";
import path from 'path';
const Geo = require('geo-nearby');
import {Client} from "@googlemaps/google-maps-services-js";


import User from "../models/User";
import Album from "../models/Album";
import Images from "../models/Images";
import Booking from '../models/Booking';


class BookingCotnroller {
    user = new User();
    album =  new Album();
    images = new Images();
    booking = new Booking();

    home = async (req: any, res: any, next: any) => {

        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            let bookingList = await  this.getFullListBooking();

            res.render("dashboard/booking",{baseUrl: res.baseUrl, userData: findUser,bookings: bookingList});    
        }else{
            res.redirect("/");
        }
    }

    create = async (req:any, res: any, next: any) => {
        try {
            if(req.session.user == undefined)
                throw new Error("Vaša seja je potekla. Prosimo vas, da se ponovno prijavite.")

            let userID = req.session.user.id;
            let data = req.body;
            let files = req.files;
            if(files.length <= 0)
                throw new Error("Seznam slik je trenutno prazen. Za ustvarjanje oglasa, izberite vsaj eno sliko !!!");
            
            
            let createAlbum: any = await this.album.create({
                user_id: userID,
                album_name: data.apartment_title,
                album_type: "Apratment"
            });
            
            if(createAlbum.saved == false)
                throw new Error(createAlbum.message);
            
            let filePath: string = `${__dirname}/../public/images/apartments/${data.apartment_title}`;
            
            if(fs.existsSync(filePath))
                throw new Error(`Booking pod tem imenom {${data.apartment_title}} že obstaja. Prosimo vas, da izberete drugo ime za nov apartma !`);
            
            fs.mkdir(filePath,(error: any) => {
                if(error) throw new Error(error);
            });
            
            for(let file of files){
                let images = new Images();
                let name = path.basename(file.path);
                await images.create({
                    album_id: createAlbum.message,
                    image_name: name
                });
                
                fs.rename(file.path, `${filePath}/${name}`, (error: any) => {
                    if(error) throw new Error(error);
                });
            }
            
            let createBooking: any = await this.booking.create(userID,createAlbum.message,data);

            if(createBooking.saved == false)
                throw new Error(createBooking.message);
            
            res.status(200).json({
                message: "Vaš oglas je bil uspešno shranjen."
            });


        } catch(error) {
            res.status(400).json({
                message: error.message
            })
        }
    }

    getLocationPlaces = async (req: any, res: any, next: any) => {
        try{
            const Axios: AxiosInstance = axios.create();
            const provider: GoogleMapsProvider = new GoogleMapsProvider(axios, 'AIzaSyAC-f4nUCWaDAmCJJzX2wOQ003bDhDHJ_M');
            const geocoder: Geocoder = new Geocoder(provider);
            const client = new Client({});

            const placeAddress = req.params;

            const location: Location[]= await geocoder.geocode({
                address: `${placeAddress.adress}`,
            });

            let getLocation : any = await Axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAC-f4nUCWaDAmCJJzX2wOQ003bDhDHJ_M&location=${location[0].latitude},${location[0].longitude}&radius=9000&type=['restaurant','spas']`).then((params: any) => {
                return params.data;
            });


            return res.status(200).json({
                priporocila: getLocation
            });
            
        } catch(error) {
            res.status(400).json({
                message: error.message
            })
        }
    
    }

    getList = async (req: any, res: any, next: any) => {
        try {
            
            let getList = await this.getFullListBooking();
            
            res.status(200).json({
                "data": getList
            });
        } catch(error) {
            res.status(400).json({
                message: error.message
            });
        }
    }


    getFullListBooking = async () => {
        let getBookings: any = await this.booking.get();
        
        let array = new Array();

        for(let booking of getBookings){
            var data: any = booking;
            let getUser : any = await this.user.get(booking.user_id);
            data.user = {
                id: getUser.id,
                name: `${getUser.first_name} ${getUser.last_name}`,
                profile:  (getUser.profile_image == null) ? '' : getUser.profile_image
            }

            let getImages: any = await this.images.get(booking.album_id);

            data.cover_image = `/images/apartments/${booking.apartment_title}/${getImages[0].image_name}`;
            
            array.push(data);
        }


        return array;

    }

    getBookingInformation = async  (req: any, res: any, next: any) => {
        try {
            let bookingID = req.params.bookingID;
            let getInfo : any = await this.booking.getByID(bookingID);

            if(getInfo.length <= 0)
                throw new Error("Iskan apartma ni na voljo, ali je dokončno izbrisani, ali je trenutno neaktiven !");
           
            let getImages : any = await this.images.get(getInfo.album_id);

            if(getImages.length <= 0)
                throw new Error("Iskan apartma, nima na voljo za prikaz slik. Morda je prišlo do napake. Ali pa je apartma izbrisan iz seznama !");

            getInfo.images = new Array();
            for(let image of getImages){
                var data = `/images/apartments/${getInfo.apartment_title}/${image.image_name}`;

                getInfo.images.push(data);
            }


            res.status(200).json({
                info: getInfo
            });



        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }



}

export default BookingCotnroller;