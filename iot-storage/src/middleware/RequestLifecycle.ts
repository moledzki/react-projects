import { Request, Response } from 'express'

declare global {
    namespace Express {
        interface Request {
            context: { [name: string]: any }
        }
    }
}
export function setupRedisClient(req: Request, res: Response, next: Function) {
    if (req.context === undefined) {
        req.context = {};
    }
    req.context.date = new Date();
    req.context.foo = "Test";
    console.log("Context created: " + JSON.stringify(req.context));

    let cleanup = () => {
        console.log("context to clean!" + JSON.stringify(req.context));
    }

    res.on("finish", cleanup);
    res.on("error", cleanup);

    next();
}