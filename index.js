"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
/* Export Controllers  */
const HomeController_1 = __importDefault(require("./controllers/HomeController"));
const DashboardController_1 = __importDefault(require("./controllers/DashboardController"));
const NewsController_1 = __importDefault(require("./controllers/NewsController"));
const BookingController_1 = __importDefault(require("./controllers/BookingController"));
const OrderController_1 = __importDefault(require("./controllers/OrderController"));
const EmailController_1 = __importDefault(require("./controllers/EmailController"));
const ErrorsController_1 = __importDefault(require("./controllers/ErrorsController"));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, Date.now() + "." + extension); //Appending .jpg
    }
});
var upload = (0, multer_1.default)({ storage: storage });
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use(express_1.default.static(path_1.default.join(__dirname, '/public')));
app.use(express_1.default.static(__dirname + '/dist'));
app.set('views', path_1.default.join(__dirname, "/views"));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.use((0, express_session_1.default)({
    secret: 'Booking Admin Site',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure: false,
        maxAge: 8 * 60 * 60 * 1000
    }
}));
/*  Setting the headers for CORS Origin Error */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    next();
});
/* Email Configuration  */
/* List of all controllers  */
let Home = new HomeController_1.default();
let Dashboard = new DashboardController_1.default();
let News = new NewsController_1.default();
let Booking = new BookingController_1.default();
let Order = new OrderController_1.default();
let Email = new EmailController_1.default();
let Error = new ErrorsController_1.default();
const router = express_1.default.Router();
app.get("/", Home.home);
app.post('/login', Home.login);
app.get("/dashboard", Dashboard.home);
/* User Setting functionallity   */
app.get("/dashboard/user/settings", Dashboard.userSettings);
app.post("/dashboard/user/update/profile", upload.single("file"), Dashboard.updateProfilePicture);
app.post("/dashboard/user/update/information", Dashboard.updateBasicInformation);
app.post("/dashboard/user/create/credit", Dashboard.createCard);
/* News Template  WITH (POST,PUT,GET, DELETE)  */
app.get("/dashboard/news", News.home);
app.post('/dashboard/news/create', upload.array("files", 15), News.create);
app.get('/dashboard/news/list', News.get);
app.post('/dashboard/news/delete/:postID', News.deletePost);
/* Booking Templates  WITH (POST,PUT,GET, DELETE)   */
app.get("/dashboard/booking", Booking.home);
app.post("/dashboard/booking/create", upload.array("files"), Booking.create);
app.get("/dashboard/get/locations/:adress", Booking.getLocationPlaces);
app.get("/dashboard/booking/get/list", Booking.getList);
app.get("/dashboard/booking/get/info/:bookingID", Booking.getBookingInformation);
app.get("/dashboard/booking/check/valid/date", Order.getOrderByDate);
/* Orders Templates WITH (POST,PUT,GET,DELETE)  */
app.get("/dashboard/booking/orders", Order.home);
app.get("/dashboard/booking/orders/:id", Order.homeView);
app.post("/dashboard/booking/order/create", Order.create);
/* Just for the API testing  */
app.get("/dashboard/booking/list/orders", Order.get);
/* Senging emails  */
app.get("/dashboard/email/recive", Email.recive);
app.post("/dashboard/email/send", Email.send);
/* 404, 400 Templates for error messages   */
app.get("*", Error.notFound);
module.exports = router;
app.use((0, cors_1.default)());
app.listen(3000, function () { return console.log("Listening on port 3000"); });
