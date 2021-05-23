import { google, oauth2_v2 } from 'googleapis';
import { GetTokenResponse, GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'
import fs = require('fs');
import { Request, Response, Application } from "express";
import Photos = require('googlephotos');



export class AuthController {
    private oauth2Client = new google.auth.OAuth2("487815936298-etevasfeipui82f2t73aa2lhef0rbfu5.apps.googleusercontent.com", process.env.PHOTOS_CLIENT_SECRETS, "http://localhost:3000/oauth2entry");

    private readonly CONFIG_FILE = ".oauth2.json";
    constructor() {
        try {
            let tokens = JSON.parse(fs.readFileSync(this.CONFIG_FILE).toString());
            this.oauth2Client.setCredentials(tokens)
        } catch (e) {
            console.log(e);
        }

    }
    public processAuthCode(req: Request, res: Response) {
        let code: string = req.query.code as string;
        console.log(code);
        if (code == null) {
            res.status(500).send({
                message: 'Code parameter missing!'
            });
        } else {
            this.oauth2Client.getToken(code).then((value: GetTokenResponse) => {
                fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(value.tokens));
                res.status(200).send("OK");
            }, (reason:any)=> {
                console.log(reason);
                res.status(500).send(reason);
            });
        }
    }

    public login(req: Request, res: Response) {

        const scopes = [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING];

        const url = this.oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',

            // If you only need one scope you can pass it as a string
            scope: scopes,
        });
        console.log(url);
        res.redirect(url);

        // Send the user to the url from above. Once they grant access they will be redirected to the
        // the redirect URL above with a query param code in the redirect. Use the code below to get the
        // access token.


    }
    public getAuthToken(): Promise<GetAccessTokenResponse> {
        return this.oauth2Client.getAccessToken();
    }
}