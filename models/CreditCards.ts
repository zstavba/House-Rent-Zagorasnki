import { json } from "stream/consumers";
import DB from "../database_modules/db";
import User from "./User";

class CreditCards {
    user = new User();
    db = new DB();
    setConnection = this.db.setConnection();

    get = (userID: number) => {
        return new Promise((resolve,reject) => {
            var cardQuery = `SELECT * FROM credit_cards WHERE user_id = ${userID}`;
            this.setConnection.query(cardQuery,(error,rows,fields) => {
                if(error) return reject(error);
                return resolve(JSON.parse(JSON.stringify(rows[0])));
            });
        }); 
    }

    create = (userID: number, params:any) => {
        return new Promise((resolve,reject) => {
            var cardQuery = `INSERT INTO credit_cards (user_id, card_number, card_cvc, card_country, card_home_adress, card_experation_date) VALUES(${userID},'${params.card_number}', '${params.card_cvc}', '${params.card_country}', '${params.card_home_adress}', '${params.card_experation_date}') `
            this.setConnection.query(cardQuery,(error,rows,fields) => {
                if(error) return reject({ saved: false, message: error });
                return resolve({ saved: true, message: "OK" });
            });
        });
    }

    update = () => {

    }

    delete = () => {
        
    }


}

export default CreditCards;