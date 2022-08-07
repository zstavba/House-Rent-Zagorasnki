import { AnyRecord } from "dns";
import User from '../models/User';
import Album from '../models/Album';
import Images from "../models/Images";

import fs from 'fs';
import path from 'path';
import News from "../models/News";


class NewsController {
    user = new User();
    news = new News();
    home = async (req:any,res:any,next: any) => {
        if(req.session.user != undefined) {
            let findUser = await  this.user.get(req.session.user.id);
            let news = await this.news.getForView();
            res.render("dashboard/news",{baseUrl: res.baseUrl, userData: findUser, newsList: news});    
        }else{
            res.redirect("/");
        }
    }

    create = async (req:any, res:any, next: any ) => {
        try{
            let data = req.body;
            let files = req.files;

            if(files.length <= 0)
                throw new Error("Preden želite ustvariti novice, vas prosimo, da izberete vsaj eno sliko.")

            const createAlbum = new Album();
            let album: any = await createAlbum.create({
                user_id: req.session.user.id,
                album_name: data.news_title,
                album_tpye: "News"
            });

            if(album.saved == false)
                throw new Error(album.message);

            let title = data.news_title;
            let filePath = __dirname+'/../public/images/'+title.replace(" ","_");

            if(fs.existsSync(filePath))
                throw new Error("Izbrano ime za to novico, že obstaja. Prosimo vas, da izberete drugo !!!");
            
            let createFolder = fs.mkdir(filePath,(error: any) => {
                if(error) throw new Error(error);
            });


            for(let file of files) {
                let images = new Images();
                let name = path.basename(file.path);
                let createImages: any = images.create({
                    album_id: album.message,
                    image_name: name
                });

                fs.rename(file.path, filePath+"/"+name, (error: any)  => {
                    if (error)  throw new Error(error);
                });
            }

            let news = new News();
            let createNews: any = await news.create({
                user_id: req.session.user.id,
                album_id: album.message,
                news_title: data.news_title,
                news_type: data.news_type,
                news_description: data.news_description
            });


            if(createNews.saved == false)
                throw new Error("Med ustvarjanjem novice je prišlo do napake !!!");

            
            res.status(200).json({
                message: "Vaša novica je bila uspešno shranjena !!!"
            });

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    get = async (req:any, res:any, next: any ) => {
        try {
            let getNews: any = await this.news.get();
    
            if(getNews.length <= 0)
                throw new Error("Seznam novic je prazen !!!");

            let array = new Array();

            for(let post of getNews){
                let user = new User();
                let getUser: any = await user.get(post.user_id);
                let album = new Album();
                let getAlbum = await album.get(post.album_id);

                var data: any = {
                    title: post.title,
                    type: post.news_type,
                    description: post.description,
                    user : {
                        id: getUser.id,
                        name: `${getUser.first_name} ${getUser.last_name}`,
                        username: getUser.username,
                        profile: (getUser.profile == null) ? 'https://i0.wp.com/newspack-washingtoncitypaper.s3.amazonaws.com/uploads/2009/04/contexts.org_socimages_files_2009_04_d_silhouette.png?fit=1200%2C756&ssl=1' : getUser.profile
                    },
                    images : []
                }

                let images = new Images();
                let getImages: any = await images.get(post.album_id);

                for(let image of getImages){

                    const imageUrl = `/images/${post.title.replace(" ","_")}/${image.image_name}`;
                    data.images.push(imageUrl);
                }

                array.push(data);
            }

            res.status(200).json({
                "news": array
            });



        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    deletePost = async (req: any,res: any,next: any) => {
        try {
            var postID = req.params.postID;

            let news = new News();
            let getSinglePost: any = await news.getByID(postID);

            if(getSinglePost == null)
                throw new Error("Iskana novica žal ne obstaja. Ste prepričani, če je ta novica na seznamu ? ");

            let images = new Images();
            let deleteImages: any= await images.delete(getSinglePost.album_id);
        
            if(!deleteImages.deleted)
                throw new Error(deleteImages.message);

            let album = new Album();
            let deleteAlbum : any = await album.delete(getSinglePost.album_id);

            if(!deleteAlbum.deleted)
                throw new Error(deleteAlbum.message);
       
            
            let deleteNews: any = await news.delete(postID);

            if(!deleteNews.deleted)
                throw new Error(deleteNews.message);

            res.status(200).json({
                message: "Izbrana novica je bila uspešno izbrisana. "
            })

        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }



}

export default NewsController;