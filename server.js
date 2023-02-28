const OAuth2Strategy = require('passport-oauth2');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios')

const app = express();
app.use(session({
    secret: '3580532335'
}));

let token = "";

// Configure OAuth 2.0 strategy
passport.use(new OAuth2Strategy({
    authorizationURL: '',
    tokenURL: '',
    clientID: '',
    clientSecret: '',
    callbackURL: 'http://localhost:3001/auth/callback',
}, (accessToken, refreshToken, profile, done) => {
     token = accessToken;
     done(null, profile);
}));

// Configure Passport to serialize and deserialize user objects
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Default Route
app.get('/', (req, res) => {
    if (token) {
        res.send(token);
    } else {
        res.send("Get Your Token First");
    }
});

// Authenticate
app.get('/auth', passport.authenticate('oauth2'));

// oAuht Call Back
app.get('/auth/callback', passport.authenticate('oauth2'), (req, res) => {
    res.redirect("/api/countrySet");
});

// API Countries Data Call
app.get('/api/countrySet', (req, res) => {
    axios({
        method: 'get',
        url: `https://sapi.q.icts.kuleuven.cloud/gwsample?$format=json`,
        headers: {
            'x-apikey': '6Hs3xvOPRAC8H7yvwPtg5jJwUngV1U4U',
            Authorization: 'Token ' + token
        }
    }).then((response) => {
        const jsonResponse = JSON.stringify(response.data);
        res.send(jsonResponse);
    })
});

// Start the server
app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
});


// Use proxy command to prevent CORS errors when testing with the react UI
// lcp --proxyUrl https://sapi.q.icts.kuleuven.cloud/gwsample