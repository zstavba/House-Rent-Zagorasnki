import DB from '../database_modules/db';
import User from './User';
import Images from './Images';
import Album from './Album';
import { rejects } from 'assert';

class News  {
    database = new DB();
    setConnection = this.database.setConnection();

    get = () => {
        return  new Promise(async (resolve: any,reject:any) => {
            var query = `SELECT * FROM news`;
            this.setConnection.query(query,(error: any,rows: any,fields: any) => {
                if(error) return reject(error);
                return resolve(rows);
            });
        });
    }

    getByID = (newsID: number): Promise<Object> => {
        return  new Promise(async (resolve: any,reject:any) => {
            var query = `SELECT * FROM news WHERE id = ${newsID}`;
            this.setConnection.query(query,(error: any,rows: any,fields: any) => {
                if(error) return reject(error);
                return resolve(JSON.parse(JSON.stringify(rows[0])));
            });
        });
    }

    create = async (params: any) => {
        return new Promise((resolve: any, reject: any) => {
            var query = `INSERT INTO news (user_id,album_id,title,news_type,description) VALUES(${params.user_id},${params.album_id}, '${params.news_title}', '${params.news_type}', ${this.setConnection.escape(params.news_description)})`;
            this.setConnection.query(query,(error,rows,fields) => {
                if(error) return reject({ saved: false,  message: error });

            });
        })
    }

    getForView =  async (): Promise<Object[]> => {
        try {
            let array = new Array();
            let news :  any  = await  this.get();

            if(news.length <= 0)
                throw new Error("Seznam novic je prazen !!!");

            for(let post of news){
                let user = new User();
                let getUser: any = await user.get(post.user_id);
                let data : any = {
                    id: post.id,
                    titile: post.title,
                    type: post.news_type,
                    text: post.description,
                    user: {
                        id: getUser.id,
                        name: `${getUser.first_name} ${getUser.last_name}`,
                        profile: (getUser.profile == null) ? 'https://i0.wp.com/newspack-washingtoncitypaper.s3.amazonaws.com/uploads/2009/04/contexts.org_socimages_files_2009_04_d_silhouette.png?fit=1200%2C756&ssl=1' : getUser.profile
                    },
                    images: []
                }
                let images = new Images();
                let getImages: any = await images.get(post.album_id);
                
                for(let image of getImages){
                    const imageUrl = `/images/${post.title.replace(" ","_")}/${image.image_name}`;
                    data.images.push(imageUrl);
                }
                
                array.push(data);
            }   
            return    array;


        } catch (error){
            return [{
                message: error.message
            }]
        }


    }

    delete = (postID: number) => {
        return new Promise((resolve,reject) => {
            var sqlDelete = `DELETE FROM news WHERE id = ${postID}`;
            this.setConnection.query(sqlDelete,(error,rows,fields) => {
                if(error) return reject({ deleted: false, message: error });

                return resolve({deleted: true, message: "OK"});
            });
        });
    }


}

export default News; 