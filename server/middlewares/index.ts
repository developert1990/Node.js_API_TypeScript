import { Request, Response, NextFunction } from 'express';
import * as types from '../types';


export const testValidator = (req: Request, res: Response, next: NextFunction) => {
    console.log('에러 헨들링하러 들어옴');
    const body: types.productInfoType = req.body
    if (!body.Price || !body.DeliveryPrice || !body.Name || !body.Description) {

        return next(new Error('Not enough information provided'));
    }

    if (typeof body.Price !== 'number' || typeof body.DeliveryPrice !== 'number') {
        console.log('넘버가 아님')
        return next(new Error('Price or DeliveryPrice is not an integer'));
    }


    next();
}

export const newOptionValidator = (req: Request, res: Response, next: NextFunction) => {
    const body: types.productOptionInfoType = req.body;
    if (!body.Description || !body.Name) {
        return next(new Error('Not enough information provided'))
    }

    if (typeof body.Name !== 'string' || typeof body.Description !== 'string') {
        return next(new Error('Name and Description should be string'));
    }

    next();
}

