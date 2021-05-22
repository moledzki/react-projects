import * as express from "express";
import { Routes } from "./routes/Routes";

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);

    }


    private config(): void{
        // support application/json type post data
        this.app.use(express.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(express.urlencoded({ extended: false }));
    }

}

export default new App().app;
