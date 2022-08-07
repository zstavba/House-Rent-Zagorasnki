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
app.set('trust proxy', 1); // trust first proxy
app.use((0, express_session_1.default)({
    secret: 'Booking Admin Site',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure: false,
        maxAge: 8 * 60 * 60 * 1000 // Dovolimo, da se Session shrane max 8 ur. Tudi ob refreshanju strani. 
    }
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    next();
});
let Home = new HomeController_1.default();
let Dashboard = new DashboardController_1.default();
let News = new NewsController_1.default();
let Booking = new BookingController_1.default();
const router = express_1.default.Router();
app.get("/", Home.home);
app.post('/login', Home.login);
app.get("/dashboard", Dashboard.home);
/* User Setting functionallity   */
app.get("/dashboard/user/settings", Dashboard.userSettings);
app.post("/dashboard/user/update/profile", upload.single("file"), Dashboard.updateProfilePicture);
app.post("/dashboard/user/update/information", Dashboard.updateBasicInformation);
/* News Template  WITH (POST,PUT,GET, DELETE)  */
app.get("/dashboard/news", News.home);
app.post('/dashboard/news/create', upload.array("files", 15), News.create);
app.get('/dashboard/news/list', News.get);
app.post('/dashboard/news/delete/:postID', News.deletePost);
/* Booking Templa
tes  WITH (POST,PUT,GET, DELETE)   */
app.get("/dashboard/booking", Booking.home);
app.get("/dashboard/booking/orders", Booking.orders);
app.get("/dashboard/booking/orders/:id", Booking.orderView);
module.exports = router;
app.use((0, cors_1.default)());
app.listen(3000, function () { return console.log("Listening on port 3000"); });
