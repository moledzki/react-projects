import { Request, Response } from 'express'

export function authApiKey(req: Request, res: Response, next: Function) {
    const apiKey = req.get('API-key');
    if (apiKey != null && process.env.IOSTORE_API_KEY === apiKey) {
        next();
    } else {
        res.status(401).json({ error: 'unauthorised' })
    }
}
 