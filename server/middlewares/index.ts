import { Request, Response, NextFunction } from 'express';

export const testValidator = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.Price) {
        return next(new Error('Price is not provied'));
    }

    if (typeof req.body.Price !== 'number') {
        return next(new Error('Price is not an integer'));
    }

    next();
}