import { google, oauth2_v2 } from 'googleapis';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'
import fs = require('fs');
import { Request, Response, Application } from "express";

export class AuthController {
    private oauth2Client = new google.auth.OAuth2("487815936298-etevasfeipui82f2t73aa2lhef0rbfu5.apps.googleusercontent.com", "process.env.PHOTOS_CLIENT_SECRETS", "http://localhost:3000/oauth2entry");

    public processAuthCode(req: Request, res: Response) {
        let code: string = req.query.code as string;

        if (code == null) {
            res.status(500).send({
                message: 'Code parameter missing!'
            });
        } else {
            this.oauth2Client.getToken(code).then((value: GetTokenResponse) => {
                fs.writeFileSync(".oauth2.json", JSON.stringify(value.tokens));
            });
        }
    }

}