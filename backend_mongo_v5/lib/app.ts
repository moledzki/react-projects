// lib/app.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";
import { setupRedisClient } from "./middleware/RequestLifecycle";

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://mongo7.mydevil.net/mo1189_nokia';  
    

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);     
        this.mongoSetup();
    }

    private mongoSetup(): void{
        var mongooseOptions = {
            useNewUrlParser: true,
            user: 'mo1189_nokia',
            pass: process.env.MO1189_NOKIA_PWD,
            promiseLibrary: global.Promise
        }
    
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, mongooseOptions);    
    }   

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(setupRedisClient);
    }

}

export default new App().app;
