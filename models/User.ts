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



}

export default User;