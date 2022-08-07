import DB from '../database_modules/db';

class Album {
    database = new DB();
    setConnection = this.database.setConnection();


    get = (albumID: number) => {
        return new Promise((resolve: any, reject: any) => {
            var sqlAlbum = `SELECT * FROM album WHERE id = '${albumID}'`;
            this.setConnection.query(sqlAlbum,(error,rows,fields) => {
                if(error) return reject(error);

                return resolve(rows);
            });
        });
    }

    create = (params: any) => {
        return new Promise((resolve,reject) => {
            var sqlQuery = `INSERT INTO album (user_id,album_name,album_type) VALUES(${params.user_id},'${params.album_name}', '${params.album_tpye}')`;
            this.setConnection.query(sqlQuery, (error, rows, fields) => {
                if (error) return reject({saved: false, message: error});

                return resolve({ saved: true, message: rows.insertId});
            });
        });
    }

    delete = (albumID: number) => {
        return new Promise((resolve,reject) => {
            var sqlDelete = `DELETE FROM album WHERE id = ${albumID}`;
            this.setConnection.query(sqlDelete,(error,rows,fields) => {
                if(error) return reject({ deleted: false, message: error });

                return resolve({deleted: true, message: "OK"});
            });
        });
    }

}


export default Album;