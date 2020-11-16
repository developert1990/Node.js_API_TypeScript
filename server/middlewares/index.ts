import { Request, Response, NextFunction } from 'express';
import * as types from '../types';
import Joi from '@hapi/joi';


// Joi 라이브러리 사용

const optionSchema = Joi.object({
    Name: Joi.string()
        .min(3)
        .required(),
    Description: Joi.string()
        .min(3)
        .required(),
});

const productSchema = Joi.object({
    Description: Joi.string()
        .required(),
    Name: Joi.string()
        .required(),
    DeliveryPrice: Joi.number()
        .required(),
    Price: Joi.number()
        .required()
})


export const newOptionValidator = (req: Request, res: Response, next: NextFunction) => {
    const body: types.productOptionInfoType = req.body;
    const { error, value } = optionSchema.validate(body);
    if (error) {
        return next(new Error(error?.message));
    }
    next();
}

export const productValidator = (req: Request, res: Response, next: NextFunction) => {
    const body: types.productInfoType = req.body;
    const { error, value } = productSchema.validate(body);
    if (error) {
        return next(new Error(error?.message));
    }
    next();
}


























// export const testValidator = (req: Request, res: Response, next: NextFunction) => {
//     console.log('에러 헨들링하러 들어옴');
//     const body: types.productInfoType = req.body
//     if (!body.Price || !body.DeliveryPrice || !body.Name || !body.Description) {

//         return next(new Error('Not enough information provided'));
//     }

//     if (typeof body.Price !== 'number' || typeof body.DeliveryPrice !== 'number') {
//         console.log('넘버가 아님')
//         return next(new Error('Price or DeliveryPrice is not an integer'));
//     }


//     next();
// }

// export const newOptionValidator = (req: Request, res: Response, next: NextFunction) => {
//     const body: types.productOptionInfoType = req.body;
//     if (!body.Description || !body.Name) {
//         return next(new Error('Not enough information provided'))
//     }

//     if (typeof body.Name !== 'string' || typeof body.Description !== 'string') {
//         return next(new Error('Name and Description should be string'));
//     }

//     next();
// }
