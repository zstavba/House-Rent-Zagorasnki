import DB from '../database_modules/db';

class Images {
    database = new DB();
    setConnection = this.database.setConnection();

    get = (albumID: number) => {
        return new Promise((resolve: any, reject: any) => {
            var imagesSql = `SELECT * FROM images WHERE album_id = '${albumID}'`;
            this.setConnection.query(imagesSql,(error,rows,fields) => {
                if(error) return reject(error);
                return resolve(rows);
            });
        });
    }


    create = (params: any) => {
        return new Promise((resolve: any,reject: any) => {
            var imagesQuery = `INSERT INTO images (album_id, image_name) VALUES(${params.album_id}, '${params.image_name}')`;
            this.setConnection.query(imagesQuery,(error,rows,fields) => {
                if(error) return reject({ saved: false, message: error });
                return resolve({ saved:true, message: "OK" });
            });
        })
    };


    delete = (albumID: number) => {
        return new Promise((resolve,reject) => {
            var sqlDelete = `DELETE FROM images WHERE album_id = ${albumID}`;
            this.setConnection.query(sqlDelete,(error,rows,fields) => {
                if(error) return reject({ deleted: false, message: error });

                return resolve({deleted: true, message: "OK"});
            });
        });
    }


}

export default Images;