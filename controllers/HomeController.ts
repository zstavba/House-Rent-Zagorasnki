import path from 'path';
import DB from '../database_modules/db';
import bcrypt from 'bcrypt';
import passport  from 'passport';

class HomeController {
    database = new DB();
    setConnection = this.database.setConnection();
    
   home = (req: any, res: any,next: any) => {
        if(req.session.user != undefined){
            if(req.session.user.isLoggedIn) res.redirect("dashboard");
            res.redirect("index");
        }else{
            res.render("index");
        }
    }
    
    login = async (req: any,res: any, next: any) => {
        try {
            this.setConnection.connect();
            var requestData = req.body;
            var query = `SELECT * FROM users WHERE username = '${requestData.email}'`;
            var data: any = await new Promise((resolve,reject) => {
               return this.setConnection.query(query,(error,result) => {
                    if (error) reject(error);
                    return resolve(JSON.parse(JSON.stringify(result[0])));
                })
            });

            let  User = data;
        
            const checkPassword = await bcrypt.compare(requestData.password,User.password);
        
            if(checkPassword){
                let userSession = req.session.user = {
                    "id": User.id,
                    "isLoggedIn": true
                };
        
                req.session.save();
        
                res.status(200).json({
                    "message": "Prijava je bila uspešna"
                });
            }else{
                throw new Error("Iskani uporabnik ni bil najden. Ali pa ste vpisali napačno geslo !");
            }
        
        }catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
}



export default HomeController;