
import { Request, Response, Application } from "express";
 import { AuthController } from "../controllers/AuthController";


import Photos = require('googlephotos');


export class Routes {
    private authController:AuthController = new AuthController();

    public routes(app: Application): void {
        app.route('/oauth2entry')
        .get(this.authController.processAuthCode);
        app.route('/')
            .get((req: Request, res: Response) => {
                const code = req.query.code;
                if (code == null) {
                    res.status(200).send({
                        message: 'GET lost!'
                    });
                } else {
                    let allAlbums=[];
                    oauth2Client.setCredentials(tokens);
                    google.

                    // The token from above can be used to initialize the photos library.
                    console.log(tokens);
                    const photos = new Photos(tokens.access_token);
                    const response = await photos.albums.list(50);
                    allAlbums.push(response.albums);
                    console.log(response.nextPageToken);
                    const response2 = await photos.albums.list(50, response.nextPageToken);
                    allAlbums.push(response2.albums);
                    res.status(200).send(allAlbums);

                }
            });
        app.route('/albums').get((req: Request, res: Response) => {



            const scopes = [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING	];

            const url = oauth2Client.generateAuthUrl({
                // 'online' (default) or 'offline' (gets refresh_token)
                access_type: 'offline',

                // If you only need one scope you can pass it as a string
                scope: scopes,
            });
            res.redirect(url);

            // Send the user to the url from above. Once they grant access they will be redirected to the
            // the redirect URL above with a query param code in the redirect. Use the code below to get the
            // access token.


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