
import { Request, Response, Application } from "express";
import { AuthController } from "../controllers/AuthController";
import { GetTokenResponse, GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'
import { PhotosService } from '../service/PhotosService'
import Photos = require('googlephotos');
const axios = require('axios');
import { oauth2 } from "googleapis/build/src/apis/oauth2";
import { LocalPhotoService } from "../service/LocalPhotoService";
import fs = require('fs');
import { PhotoAlbum } from "model/PhotoAlbum";
const path = require('path');

export class Routes {
    private authController: AuthController = new AuthController();



    public processAlbums(result: Array<any>, photos) {
        photos.albums.list(50).then(albums => {
            result.push(albums.albums);
            if (albums.nextPageToken != null) {
                // this.processAlbums(result, )
            }
        })
    }

    public mergeDuplicates(source: Array<PhotoAlbum>): Array<PhotoAlbum> {
        let temp: { [k: string]: number } = {}
        source.forEach(album => {
            if (temp[album.name]) {
                temp[album.name] += album.photoNumber;
            } else {
                temp[album.name] = album.photoNumber;
            }
        });
        let merged: Array<PhotoAlbum> = [];
        for (const [key, value] of Object.entries(temp)) {
            merged.push({ name: key, photoNumber: value });
        }

        return merged;
    }

    public routes(app: Application): void {
        app.route('/dir').get((req: Request, res: Response) => {
            res.status(200).send(new LocalPhotoService().getAllAlbums2('c:\\Users\\Public\\Pictures\\Aparat\\Zdjęcia\\raw'));

        })
        app.route('/oauth2entry')
            .get(this.authController.processAuthCode.bind(this.authController));
        app.route('/login').get((req: Request, res: Response) => this.authController.login(req, res));
        app.route('/find').get((req: Request, res: Response) => {
            let googlePhotosAlbums: Array<any> = JSON.parse(fs.readFileSync("w:\\Downloads\\albums.json").toString());
            let remotePhotoAlbumsDuplicate: Array<PhotoAlbum> = googlePhotosAlbums.map(gpa => { return <PhotoAlbum>{ name: gpa.title, photoNumber: gpa.mediaItemsCount } });
            // let localPhotoAlbums:Array<PhotoAlbum> = new LocalPhotoService().getAllAlbums2('c:\\Users\\Public\\Pictures\\Aparat\\Zdjęcia\\raw');
            let localPhotoAlbums: Array<PhotoAlbum> = new LocalPhotoService().getAllAlbums2('j:\\developed.pictures.google\\raw');
            let localVideoAlbums: Array<PhotoAlbum> = new LocalPhotoService().getAllAlbums2('j:\\developed.pictures.google\\movies');
            let allLocalAlbumsWithDuplicate = localPhotoAlbums.concat(localVideoAlbums);

            let allLocalMerged = this.mergeDuplicates(allLocalAlbumsWithDuplicate);
            let remotePhotoAlbumsMerged = this.mergeDuplicates(remotePhotoAlbumsDuplicate);

            let everythingUploaded: Array<PhotoAlbum> = [];
            let somePicturesMissing: Array<PhotoAlbum> = [];
            let somePicturesDuplicated: Array<PhotoAlbum> = [];
            let toBeUploaded: Array<PhotoAlbum> = [];

            allLocalMerged.forEach(localAlbum => {
                remotePhotoAlbumsMerged.forEach(googleAlbum => {
                    if (localAlbum.name == googleAlbum.name) {
                        if (localAlbum.photoNumber == googleAlbum.photoNumber) {
                            everythingUploaded.push(localAlbum);
                        } else if (localAlbum.photoNumber > googleAlbum.photoNumber) {
                            somePicturesMissing.push(localAlbum);
                        } else {
                            somePicturesDuplicated.push(localAlbum);
                        }
                    }
                })
            });
            allLocalMerged.forEach(localAlbum => {
                let isInEverything = false;
                let isInPartial = false;
                let isInDuplicated = false;

                everythingUploaded.forEach(alb => {
                    if (localAlbum.name == alb.name) {
                        isInEverything = true;
                    }
                });
                somePicturesMissing.forEach(alb => {
                    if (localAlbum.name == alb.name) {
                        isInPartial = true;
                    }
                });
                somePicturesDuplicated.forEach(alb => {
                    if (localAlbum.name == alb.name) {
                        isInDuplicated = true;
                    }
                });

                if (!isInEverything && !isInPartial && !isInDuplicated) {
                    toBeUploaded.push(localAlbum);
                }
            });

            res.status(200).send({
                missing: toBeUploaded,
                partial: somePicturesMissing,
                duplicate: somePicturesDuplicated,
                OK: everythingUploaded
            });

        });

        app.route('/albums2').get((req: Request, res: Response) => {
            new PhotosService(this.authController).getAllAlbums().then(albums => {
                console.log("ALL albums: " + albums.length);
                res.status(200).send(albums);
            })
        });
        app.route('/albums').get(async (req: Request, res: Response) => {
            // new PhotosService(this.authController).getAllAlbums().then((albums=> {
            //     res.status(200).send(albums);
            // }));

            let allAlbums = [];
            try {
                let authToken = await this.authController.getAuthToken();

                // let albumResult = await axios.get('https://photoslibrary.googleapis.com/v1/albums', {
                //     headers: {
                //         'Authorization': 'Bearer ' + authToken.token
                //     }
                // });
                // console.log(albumResult.data.nextPageToken);
                // console.log(albumResult.data.nextPageToken.length);
                let nextPageToken = null;
                let albumResult = null;
                do {
                    let options: any = {
                        headers: {
                            'Authorization': 'Bearer ' + authToken.token
                        }
                    };
                    if (nextPageToken != null) {
                        options.params = { pageToken: albumResult.data.nextPageToken };

                    }
                    albumResult = await axios.get('https://photoslibrary.googleapis.com/v1/albums', options);
                    console.log("New albums:" + albumResult.data.albums.length);
                    allAlbums.push(...albumResult.data.albums);
                    nextPageToken = albumResult.data.nextPageToken;
                    // console.log(nextPageToken);
                    // if(nextPageToken) {
                    //     console.log("tru");
                    // }
                } while (nextPageToken)

                // console.log("Album length in resposne: " + res.data.albums.length);
                // console.log("All albums length before: " + allAlbums.length);
                // console.log("Added albums: " + allAlbums.push(res.data.albums));
                // console.log("Added albums[0]: " + allAlbums.push(res.data.albums[0]));
                // console.log("All albums length after: " + allAlbums.length);
                // console.log("Allalbums: " + allAlbums);


                // let photos = new Photos(token.token);
                // let result = await photos.albums.list(50);
                // while (result.nextPageToken != null && result.nextPageToken.length > 0) {
                //     console.log("Retrieved albums: " + result.albums.length);
                //     allAlbums.push(result.albums);
                //     result = await photos.albums.list(50, result.nextPageToken);
                // }
                console.log("All albums has been rerieved! " + allAlbums.length);
                res.status(200).send(allAlbums);



            } catch (error) {
                console.log(error);
                res.status(500).send({ error: error });
            }



            // const response = await photos.albums.list(50);
            // allAlbums.push(response.albums);
            // console.log(response.nextPageToken);
            // const response2 = await photos.albums.list(50, response.nextPageToken);
            // allAlbums.push(response2.albums);
            // res.status(200).send(allAlbums);

        });
        app.route('/getToken').get((req: Request, res: Response) => {
            this.authController.getAuthToken().then(token => res.status(200).send(token));
        })
        app.route('/')
            .get((req: Request, res: Response) => {
                // let allAlbums = [];
                // oauth2Client.setCredentials(tokens);
                // google.

                //     // The token from above can be used to initialize the photos library.
                //     console.log(tokens);
                // const photos = new Photos(tokens.access_token);
                // const response = await photos.albums.list(50);
                // allAlbums.push(response.albums);
                // console.log(response.nextPageToken);
                // const response2 = await photos.albums.list(50, response.nextPageToken);
                // allAlbums.push(response2.albums);
                // res.status(200).send(allAlbums);
                res.status(200).send("OK");
            }
            );
        app.route('/albums').get((req: Request, res: Response) => {



        });

        // app.route('/api/:chanelName')
        //     .get(this.probeController.getProbes)
        //     .post(this.probeController.addNewProbe);

        // app.route('/api/:chanelName/:probeId')
        //     .get(this.probeController.getProbeWithID)
        //     .put(this.probeController.updateProbe)
        //     .delete(this.probeController.deleteProbe);

    }
}