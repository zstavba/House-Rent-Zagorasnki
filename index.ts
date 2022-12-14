"use strict";

import express from 'express';
import path from "path";
import cors from 'cors';
import expressLayouts from 'express-ejs-layouts';
import mysql from 'mysql';
import session from 'express-session';
import multer from 'multer';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

/* Export Controllers  */
import HomeController  from './controllers/HomeController';
import DashboardController from './controllers/DashboardController';
import NewsController from './controllers/NewsController';
import BookingCotnroller from './controllers/BookingController';
import OrderController from './controllers/OrderController';
import EmailController from './controllers/EmailController';
import ErrorsController from './controllers/ErrorsController';


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, Date.now() +"."+ extension) //Appending .jpg
  }
})

var upload = multer({ storage: storage });

var app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + '/dist'));
app.set('views', path.join(__dirname,"/views"));


app.set('view engine', 'ejs');

app.set('trust proxy', 1);

app.use(session({
  secret: 'Booking Admin Site',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: { 
    secure: false,
    maxAge: 8*60*60*1000  
  }
}));

/*  Setting the headers for CORS Origin Error */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');

  next();
});

/* Email Configuration  */

/* List of all controllers  */
let Home = new HomeController();
let Dashboard = new DashboardController();
let News = new NewsController();
let Booking = new BookingCotnroller();
let Order = new OrderController();
let Email = new EmailController();
let Error = new ErrorsController();

const router = express.Router();

app.get("/",Home.home);
app.post('/login',Home.login);
app.get("/dashboard",Dashboard.home);

/* User Setting functionallity   */
app.get("/dashboard/user/settings",Dashboard.userSettings);
app.post("/dashboard/user/update/profile",upload.single("file"),Dashboard.updateProfilePicture);
app.post("/dashboard/user/update/information",Dashboard.updateBasicInformation);
app.post("/dashboard/user/create/credit",Dashboard.createCard);

/* News Template  WITH (POST,PUT,GET, DELETE)  */
app.get("/dashboard/news",News.home);
app.post('/dashboard/news/create',upload.array("files",15),News.create);
app.get('/dashboard/news/list',News.get);
app.post('/dashboard/news/delete/:postID',News.deletePost);

/* Booking Templates  WITH (POST,PUT,GET, DELETE)   */
app.get("/dashboard/booking",Booking.home);
app.post("/dashboard/booking/create",upload.array("files"),Booking.create);
app.get("/dashboard/get/locations/:adress",Booking.getLocationPlaces);
app.get("/dashboard/booking/get/list",Booking.getList);
app.get("/dashboard/booking/get/info/:bookingID",Booking.getBookingInformation);

app.get("/dashboard/booking/check/valid/date",Order.getOrderByDate);

/* Orders Templates WITH (POST,PUT,GET,DELETE)  */
app.get("/dashboard/booking/orders",Order.home);
app.get("/dashboard/booking/orders/:id",Order.homeView);
app.post("/dashboard/booking/order/create",Order.create);

/* Just for the API testing  */
app.get("/dashboard/booking/list/orders",Order.get);

/* Senging emails  */
app.get("/dashboard/email/recive",Email.recive)
app.post("/dashboard/email/send",Email.send);


/* 404, 400 Templates for error messages   */
app.get("*",Error.notFound);


module.exports = router;



app.use(cors());
app.listen(3000, function () { return console.log("Listening on port 3000"); });
