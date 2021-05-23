
import { Request, Response, Application } from "express";
import { AuthController } from "../controllers/AuthController";
import { GetTokenResponse, GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'


import Photos = require('googlephotos');
import { oauth2 } from "googleapis/build/src/apis/oauth2";


export class Routes {
    private authController: AuthController = new AuthController();


    public processAlbums(result: Array<any>, photos) {
        photos.albums.list(50).then(albums=> {
            result.push(albums.albums);
            if(albums.nextPageToken != null) {
                // this.processAlbums(result, )
            }
        })
    }
    public routes(app: Application): void {
        app.route('/oauth2entry')
            .get(this.authController.processAuthCode.bind(this.authController));
        app.route('/login')
            .get((req: Request, res: Response) => this.authController.login(req, res));
        app.route('/albums').get((req: Request, res: Response) => {
            this.authController.getAuthToken().then((token: GetAccessTokenResponse) => {
                let access_token=token.token;
                const photos = new Photos(access_token);

                photos.albums.list(50).then(albums=> {
                    res.status(200).send(albums);
                });
            });
            
            
                // const response = await photos.albums.list(50);
                // allAlbums.push(response.albums);
                // console.log(response.nextPageToken);
                // const response2 = await photos.albums.list(50, response.nextPageToken);
                // allAlbums.push(response2.albums);
                // res.status(200).send(allAlbums);
  
        });
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