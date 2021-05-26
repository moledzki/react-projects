import { AuthController } from "controllers/AuthController";
import { GetTokenResponse, GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client'
const axios = require('axios');
import Photos = require('googlephotos');

export class PhotosService {
    authController: AuthController;

    constructor(authController: AuthController) {
        this.authController = authController;
    }
    // getAlbumsFragment(nextPageToken: string): Promise<any> {
    //     return this.authController.getAuthToken().then((token: GetAccessTokenResponse) => {
    //         if (nextPageToken != null && nextPageToken.length > 0) {
    //             console.log("In getAlbumsFragment");
    //             console.log("Next token: " + nextPageToken);
    //             return new Photos(token.token).albums.list(50, nextPageToken);
    //         } else {
    //             console.log("In getAlbumsFragment - initial");
    //             return new Photos(token.token).albums.list(50);
    //         }
    //     }, (reason: any) => {
    //         console.log("Error occured: " + reason);
    //     });

    // }

    getAlbumsFragment(nextPageToken: string): Promise<any> {
        return this.authController.getAuthToken().then((authToken: GetAccessTokenResponse) => {
            if (nextPageToken != null && nextPageToken.length > 0) {
                return axios.get('https://photoslibrary.googleapis.com/v1/albums', {
                    headers: {
                        'Authorization': 'Bearer ' + authToken.token
                    },
                    params: { pageToken: nextPageToken }
                });
            }
            else {
                return axios.get('https://photoslibrary.googleapis.com/v1/albums', {
                    headers: {
                        'Authorization': 'Bearer ' + authToken.token
                    }
                });
            }
        });
    };



    getAllAlbums(nextPageToken: string = null): Promise<any> {
        // console.log("Entering getAllAlbums");
        return this.getAlbumsFragment(nextPageToken).then(fragment => {
            // console.log("In getAllAlbums promise");
            if (fragment.data.albums) {
                console.log("Retrevied albums: " + fragment.data.albums.length);
                // console.log(fragment.nextPageToken);
                if (fragment.data.nextPageToken) {
                    // console.log("Has next page: " + fragment.data.nextPageToken);
                    return this.getAllAlbums(fragment.data.nextPageToken).then(
                        nextFragment => {
                            // console.log("Next fragment: " + JSON.stringify(nextFragment));
                            console.log("Before concat: " + fragment.data.albums.length);
                            console.log("Appending: " + nextFragment.length);
                            let joined = fragment.data.albums.concat(nextFragment);
                            console.log("After appending: " + joined.length);
                            return joined;
                        }
                    );
                } else {
                    console.log("No next pageToken")
                    return new Promise((resolve, reject) => {
                        resolve(fragment.data.albums);
                    });
                }
            } else {
                console.log("Empty response!!!");
                return new Promise((resolve, reject) => {
                    resolve([]);
                });
            }
        }, (reason: any) => {
            console.log("Error");
            console.log(reason);
        });
    }

}