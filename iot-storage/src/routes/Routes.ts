
import { Request, Response, Application } from "express";
import { ProbeController } from "../controllers/ProbeController";


export class Routes {
    public probeController: ProbeController = new ProbeController();
    public routes(app: Application): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET lost!'
                })
            });

        app.route('/api/:chanelName')
            .get(this.probeController.getProbes)
            .post(this.probeController.addNewProbe);

            app.route('/api/:chanelName/:probeId')
            .get(this.probeController.getProbeWithID)
            .put(this.probeController.updateProbe)
            .delete(this.probeController.deleteProbe);

    }
}