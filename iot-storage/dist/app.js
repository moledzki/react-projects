"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
const express = require("express");
const bodyParser = require("body-parser");
const Routes_1 = require("./routes/Routes");
const mongoose = require("mongoose");
const RequestLifecycle_1 = require("./middleware/RequestLifecycle");
const AuthAPIKey_1 = require("./middleware/AuthAPIKey");
class App {
    constructor() {
        this.routePrv = new Routes_1.Routes();
        this.mongoUrl = 'mongodb://mongo7.mydevil.net/mo1189_iotstore';
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    mongoSetup() {
        var mongooseOptions = {
            useNewUrlParser: true,
            user: 'mo1189_iotstore',
            pass: process.env.MO1189_IOT_STORE_PWD,
            promiseLibrary: global.Promise,
            useUnifiedTopology: true
        };
        // mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, mongooseOptions);
    }
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(RequestLifecycle_1.setupRedisClient);
        this.app.use(AuthAPIKey_1.authApiKey);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map