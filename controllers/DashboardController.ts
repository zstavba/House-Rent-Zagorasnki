import fs from 'fs';
import { basename } from 'path';


import UserObject from '../classes/UserObject';
import CreditCards from '../models/CreditCards';
import User from '../models/User';


class DashboardController {
    user = new User();
    creditCard = new CreditCards();

    home = async  (req: any, res: any, next : any) => {
        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);

            res.render("dashboard/home",{baseUrl: res.baseUrl, userData: findUser});    
        }else{
            res.redirect("/");
        }
    }

    userSettings = async  (req:any, res: any, next: any) => {
        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            let getCard = await this.creditCard.get(req.session.user.id);
            res.render("dashboard/userSettings",{baseUrl: res.baseUrl, userData: findUser, card: getCard});    
        }else{
            res.redirect("/");
        }
    }

    updateProfilePicture =  async(req:any, res:any, next:any) => {
        try {
            if(req.session.user == undefined)
                throw new Error("Vaša seja je potekla prosimo vas, da se ponovno prijative v sistem");
            
            let userId = req.session.user.id;
            let file = req.file;

            let name = basename(file.path);

            let userObject: any = await  this.user.get(userId);
            let userPath = __dirname+`/../public/images/users/${userObject.username}`;

            if(fs.existsSync(userPath) == false) {
                this.createFolder(userPath);
                this.uploadFolder(file.path,userPath+"/"+name);
            }else{
                this.uploadFolder(file.path,userPath+"/"+name);
            }
            
            let update: any = await this.user.updateProfile(userId, `/public/images/users/${userObject.username}/${name}`);

            if(!update.updated)
                throw new Error(update.message);

            res.status(200).json({
                "message": "Posodobitev profilne slike je bila uspešna. "
            });

        } catch(error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    uploadFolder = (filePath: string, fileName: string) => {
        fs.rename(filePath,fileName, (error: any) => {
            if(error) throw new Error(error);
        });
    }

    createFolder = (filePath: string) => {
        fs.mkdir(filePath,{recursive: true},(error: any) => {
            if(error) throw new Error(error);
        });
    }


    updateBasicInformation = async (req:any, res: any, next: any) => {
        try {   
            if(req.session.user == undefined)
                throw new Error("Vaša seja je potekla, prosimo vas, da se ponovno prijavite v sistem !!!");

            let data = req.body;
            let userID = req.session.user.id;
            let getUser: any = await this.user.get(userID);
        
            Object.values(data).every(async (dataValue,index) => {
                if(dataValue !== Object.values(getUser)[index]){
                    let updateInfo = await this.user.updateInfo(userID,{
                        key: Object.keys(data)[index],
                        value: dataValue
                    });
                }
            });
          
            res.status(200).json({
                message: "Vaši podatki so bili uspešno posodobljeni."
            });

        } catch(error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    createCard = async (req: any, res: any, next: any) => {
        try {
            if(req.session.user == undefined)
                throw new Error("Vaša seja je potekla, prosimo vas, da se ponovno prijavite !");

             var userID = req.session.user.id;
             var data = req.body;   
            
             let createCard:any = await this.creditCard.create(userID,data);

             if(createCard.saved == false)
                    throw new Error(createCard.message);
             

             res.status(200).json({
                message: "Vaša kreditna kartica je bila uspešno shranjena !"
             });
            

        } catch(error) {
            res.status(400).json({
                message: error.message
            });
        }
    }


}

export default DashboardController;