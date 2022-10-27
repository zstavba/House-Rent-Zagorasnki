import DB from '../database_modules/db';
import UserObject from '../classes/UserObject';
class User {
    database = new DB();
    setConnection = this.database.setConnection();

    get = async <UserObject>(userID : number) => {
        var query = `SELECT * FROM users WHERE id = '${userID}'`;
        let userData = new Promise((resolve,reject) => {
            this.setConnection.query(query,(error,rows,fields) => {
                if(error) return reject(error);
                return resolve(JSON.parse(JSON.stringify(rows[0])));
            });
        });

        return userData;
    }

    getByData = (email: any) => {
        return new Promise((resolve,reject) => {
            var getUser = `SELECT * FROM users WHERE email = '${email}'`;
            this.setConnection.query(getUser,(error,rows,fields) => {
                if(error) return reject(error);
  
                return resolve(rows);
            });
        });
    }

    updateProfile = (userID: number, imagePath: string) => {
        return new Promise((resolve,reject) => {
            var updateQuery = `UPDATE users SET profile_image = '${imagePath}' WHERE id = ${userID}`;
            this.setConnection.query(updateQuery,(error,rows,fields) => {
                if(error) return reject({ updated: false, message: error});

                return resolve({ updated: true, message: "OK" });
            });
        });
    }

    updateInfo = (userID: number, params: any) => {
        return new Promise((resolve, reject) => {
            var updateQuery = `UPDATE users SET ${params.key} = '${params.value}' WHERE id = ${userID}`;
            this.setConnection.query(updateQuery,(error,rows,fields) => {
                if(error) return reject({ updated: false, message: error });

                return resolve({ updated: true, message: "OK" });
            });

        });
    }


    create = (params: any) => {
        return new Promise((resolve,reject) => {
            var createQuery = `INSERT INTO users (first_name,last_name,email,phone_number,home_address) VALUES('${params.first_name}','${params.last_name}','${params.rent_email}','${params.phone_number}','${params.home_address}')`;
            this.setConnection.query(createQuery,(error,rows,fields) => {
                if(error) return reject({saved: false, message: error});

                /* We need the ID for the database later on !  */
                return resolve({ saved: true, message: rows.insertId });
            });
        });
    }



}

export default User;