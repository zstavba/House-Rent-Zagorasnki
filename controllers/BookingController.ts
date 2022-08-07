import User from "../models/User";

class BookingCotnroller {
    user = new User();

    home = async (req: any, res: any, next: any) => {

        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            res.render("dashboard/booking",{baseUrl: res.baseUrl, userData: findUser});    
        }else{
            res.redirect("/");
        }
    }


    orders = async (req: any, res: any, next: any) => {
        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            res.render("dashboard/orders",{baseUrl: res.baseUrl, userData: findUser});    
        }else{
            res.redirect("/");
        }   
    }

    orderView = async (req: any,res: any, next: any) => {
        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            res.render("dashboard/orderview",{baseUrl: res.baseUrl, userData: findUser});    
        }else{
            res.redirect("/");
        }   
    }

}

export default BookingCotnroller;