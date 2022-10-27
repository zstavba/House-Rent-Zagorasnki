import 'reflect-metadata';
import { Distance, Location, Geocoder, GoogleMapsProvider, Suggestion, TravelModeEnum } from '@goparrot/geocoder';
import axios, { AxiosInstance } from 'axios';
import fs from "fs";
import path from 'path';

import User from "../models/User";
import Album from "../models/Album";
import Images from "../models/Images";
import Booking from '../models/Booking';
import Order from '../models/Order';
import { stringify } from 'querystring';

class OrderController {
    user = new User();
    album =  new Album();
    images = new Images();
    booking = new Booking();
    order = new Order();


    home = async (req: any, res: any, next: any) => {
        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            let getOrders = await this.getList();


            res.render("dashboard/orders",{baseUrl: res.baseUrl, userData: findUser, orders: getOrders});    
        }else{
            res.redirect("/");
        }   
    }


    homeView = async (req: any,res: any, next: any) => {
        if(req.session.user != undefined) {
        
            let findUser = await  this.user.get(req.session.user.id);
            let information = await this.getInformation(req.params.id);

            if(information.length <= 0){
                res.render("dashboard/errors/404");
            } else{
                res.render("dashboard/orderview",{baseUrl: res.baseUrl, userData: findUser, orderInfo: information});    
            }

        }else{
            res.redirect("/");
        }   
    }

    create = async (req:any, res: any, next: any) => {
        try {
            let data = req.body;

            let getUser:any = await this.user.getByData(data.rent_email);

            let userID: any = (getUser.length <= 0) ? null :  getUser[0].id;

            if(getUser.length <= 0) {
                let createUser: any = await this.user.create({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    rent_email: data.rent_email,
                    phone_number: data.phone_number,
                    home_address: data.home_address
                });

                if(!createUser.saved)
                    throw new Error(createUser.message);

                userID = createUser.message;
            }

            let createOrder : any = await this.order.create(userID, data.apartmentID, data);

            if(createOrder.saved == false) 
                throw new Error(createOrder.message);


            res.status(200).json({
                message: "Vaše naročilo je bilo uspešno oddano."
            });

        } catch(error) {
            res.status(400).json({
                message: error
            });
        }
    }


    get = async (req:any, res:any, next: any) => {
        try {
            let getOrders: any = await this.order.get();

            if(getOrders.length <= 0)
                throw new Error("Vaš seznam je trenutno prazen.");

            let list = new Array();

            for(let order_item of getOrders){
                let data: any = order_item;
                let getUser : any = await this.user.get(order_item.user_id);

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
                }

                let getApartment: any = await this.booking.getByID(order_item.apartment_id);

                data.apartment = {
                    name: getApartment.apartment_title
                }


                list.push(data);
            }

            res.status(200).json({
                orders_list: list
            });


        } catch(error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    getList = async () => {
        let getOrders: any = await this.order.get();

        let list = new Array();

        for(let order_item of getOrders){
            let data: any = order_item;
            let getUser : any = await this.user.get(order_item.user_id);

            data.user = {
                name: `${getUser.first_name} ${getUser.last_name}`,
                email: `${getUser.email}`
            }

            let getApartment: any = await this.booking.getByID(order_item.apartment_id);

            data.apartment = {
                name: getApartment.apartment_title
            }


            list.push(data);
        }

        return list;
    }

    getInformation = async (orderID : number) => {
        let getInfo: any = await this.order.getById(orderID);
        
        if(getInfo == undefined){
            return [];
        }


        let getUser: any = await this.user.get(getInfo.user_id);
        let getApartment: any = await this.booking.getByID(getInfo.apartment_id);

        getInfo.user = {
            name: `${getUser.first_name} ${getUser.last_name}`,
            profile: (getInfo.profile_image == null) ? 'https://i0.wp.com/newspack-washingtoncitypaper.s3.amazonaws.com/uploads/2009/04/contexts.org_socimages_files_2009_04_d_silhouette.png?fit=1200%2C756&ssl=1' : getInfo.profile_image,
            email: getUser.email,
            phone_number: getUser.phone_number,
            home_address: getUser.home_address,
            place: getUser.home_address.split(",")[1]
        }

        getInfo.apartment = {
            name: getApartment.apartment_title
        }

        return getInfo;


    }

    getOrderByDate = async (req:any,res:any,next: any) => {
        try {
            var data = req.body;
            let checkDate:any = await this.order.get();

            if(checkDate.length <= 0)
                throw new Error("Vsi termini so za izbran mesec prosti !!!");
            
            
            var listOfArray = new Array();
            for(let date of checkDate){
                let user: any = await this.user.get(date.user_id);
                var object: any = {
                    user: {
                        name: `${user.first_name} ${user.last_name}`,
                        profile: user.profile_image
                    },
                    rent_from: date.rent_from,
                    rent_to: date.rent_to
                }
                listOfArray.push(object);
            }

            res.status(200).json({
                information: listOfArray
            });

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

}

export default OrderController;