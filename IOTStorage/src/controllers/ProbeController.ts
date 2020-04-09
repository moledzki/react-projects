import * as mongoose from 'mongoose';
import { ProbeSchema } from '../models/ProbeModel';
import { Request, Response } from 'express';

export class ProbeController {

    public addNewProbe(req: Request, res: Response) {
        let ProbeModel=mongoose.model(req.params.chanelName, ProbeSchema);
        let instance = new ProbeModel({"probe": req.body});
        instance.save((err, entity) => {
            if(err) {
                res.send(err);
            } else {
                res.json(entity);
            }
        });
    }

    public getProbes (req: Request, res: Response) {
        let ProbeModel=mongoose.model(req.params.chanelName, ProbeSchema);
        ProbeModel.find({}, (err, probe) => {
            if(err){
                res.send(err);
            }
            res.json(probe);
        });
    }
    public getProbeWithID (req: Request, res: Response) {           
        let ProbeModel=mongoose.model(req.params.chanelName, ProbeSchema);
        ProbeModel.findById(req.params.probeId, (err, probe) => {
            if(err){
                res.send(err);
            }
            res.json(probe);
        });
    }
    public updateProbe (req: Request, res: Response) {
        let ProbeModel=mongoose.model(req.params.chanelName, ProbeSchema);
        ProbeModel.findOneAndUpdate({ _id: req.params.probeId }, req.body, { new: true }, (err, probe) => {
            if(err){
                res.send(err);
            }
            res.json(probe);
        });
    }
    public deleteProbe (req: Request, res: Response) {           
        let ProbeModel=mongoose.model(req.params.chanelName, ProbeSchema);
        ProbeModel.remove({ _id: req.params.probeId }, (err) => {
            if(err){
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!'});
        });
    }
}