const {google} = require('googleapis');
const Photos = require('googlephotos');

const oauth2Client = new google.auth.OAuth2("487815936298-etevasfeipui82f2t73aa2lhef0rbfu5.apps.googleusercontent.com", "PWTU65OxceXba_0e31T3a4xr", "http://localhost:3000");

const scopes = [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
});

// Send the user to the url from above. Once they grant access they will be redirected to the
// the redirect URL above with a query param code in the redirect. Use the code below to get the
// access token.

const {tokens} = await oauth2Client.getToken(code);

// The token from above can be used to initialize the photos library.

const Photos = require('googlephotos');

const photos = new Photos(tokens);
