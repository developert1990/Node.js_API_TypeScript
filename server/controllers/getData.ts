import express, { Request, Response } from 'express';
import * as types from '../types';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { getConnection } from '../index';

import { findAllProductOption, findAllProducts, createUUID } from '../commands/constants';


const app = express();
app.use(express.json());


export const sum = (a: number, b: number) => {
    return a + b;
}





// open DB
// let db = new sqlite3.Database('./data/products.db', (err) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log('Connected to the mydb database.');
//     }
// });






export const connect = (req: Request, res: Response) => {
    console.log('req: ', req)
    res.send('DB and Server are connected');
}


const executeDBQuery = async (query: string, input = []) => {
    const db = await getConnection();
    const rows = await db.all(query, input);
    return rows;
}

export const getAllProducts = async (req: Request, res: Response) => {
    // 이렇게요

    // db.serialize();

    // 네 먼저 함수 전부 async await으로 바꿔보시고 yup이나 joi 이용하셔서 validation도 한번 만들어보세요 그다음에 그게 다 되면
    // 테스트 하는건 더 쉬워져요 
    // 아 그건 만약에 인풋자체에 값이 먼가 의도적으로 malicious한게 왓다거나 이런걸 전부 걸러주는 필터같은 역할이라고 보면되는데요 
    // 프론트에서 만약에 머 인풋값 받는 그런 필드에서 막 제한하잖아요 패스워드면 영문/특문으로 제한 이런거 이런걸 말하는거에요
    // 근데 joi같은 라이브러리에서 그냥 다 알아서해줘요 



    // console.log('req name: ', req.query.name);
    const db = await getConnection();

    if (req.query.name === undefined) {
        // 1. gets all products

        const rows = await db.all(findAllProducts);
        if (rows.length === 0) {
            res.send({ msg: 'No data founded', state: 500 });
        } else {
            res.send(rows);
        }
    } else {
        // 2. finds all products matching the specified name.

        const name = req.query.name;
        const newName = name.toString().charAt(0).toUpperCase() + name.toString().slice(1);

        const rows = await db.all(`select * from Products where name like ?`, [`%${newName}%`]);
        if (rows.length === 0) {
            res.send({ msg: 'No data with this name', state: 500 });
        } else {
            res.send(rows);
        }

    }

}

// /0643CCF0-AB00-4862-B3C5-40E2731ABCC9

// 3. gets the productsOptions that matches the specified ID - ID is a GUID.

export const getProductByID = async (req: Request, res: Response) => {
    const db = await getConnection();
    if (req.params.id !== undefined) {

        const id = req.params.id
        const rows = await db.get(`select * from ProductOptions where id = ?`, [id]);
        if (!rows) {
            res.send({ msg: 'No data with this id', state: 500 });
        } else {
            res.send(rows);
        }

    }
}


// 4. Creates a new product with POST method.

export const createProduct = async (req: Request, res: Response) => {

    const db = await getConnection();

    const productsInfo: types.productInfoType = req.body
    const UUID_ID: string = createUUID().toUpperCase();

    // insert into Products table
    const rows = await db.run(`INSERT INTO Products VALUES (?,?,?,?,?)`,
        [UUID_ID, productsInfo.Name, productsInfo.Description, productsInfo.Price, productsInfo.DeliveryPrice]);


    res.send('Data inserted into Products successfully');

}

// {
//     "Name": "Xiaomi Redmi 6",
//         "Description": "Newest mobile product from Xiaomi.",
//             "Price": 900.99,
//                 "DeliveryPrice": 8.99
// }



// 5. updates a product
// 이부분 좀 여쭤 봐야함
export const updateProducts = async (req: Request, res: Response) => {

    const db = await getConnection();
    const id: string = req.params.id;
    const data: types.productInfoType = req.body;

    const result = await db.run(`UPDATE Products SET Name=?, Description=?, Price=?, DeliveryPrice=? where Id=?`, [data.Name, data.Description, data.Price, data.DeliveryPrice, id]);
    console.log('result', result)
    // if (err) {
    //     console.log(err.message);
    // } else {
    //     console.log('Data inserted into ProductOption successfully');
    // }

    res.send('All data updated Successfully')
}

// {
//         "Name": "Google pixel S6",
//         "Description": "Newest mobile product from google.",
//         "Price": 1039.99,
//         "DeliveryPrice": 14.99
//     },




// 6. delete a product and its options

export const deleteProductAndOptions = async (req: Request, res: Response) => {
    const db = await getConnection();
    const id: string = req.params.id;

    const rows_1 = await db.run(`DELETE FROM Products where Id= ?`, [id]);
    console.log('rows_1', rows_1)
    if (!rows_1) {
        res.send({ msg: 'No data with this id', state: 500 });
    } else {
        res.send(`Data deleted successfully`);
    }

    const rows_2 = await db.run(`DELETE FROM ProductOptions where ProductId= ?`, [id]);
    if (!rows_2) {
        res.send({ msg: 'No data with this id', state: 500 });
    } else {
        res.send(`Data deleted successfully`);
    }

}


// [
//     {
//         "Name": "Google pixel S6",
//         "Description": "Newest mobile product from google.",
//         "Price": 1039.99,
//         "DeliveryPrice": 14.99
//     },
//     {
//         "Name": "Red",
//         "Description": "Google pixel S6"
//     }
// ]



// 7. finds all options for a specified product.

export const findAllOptionsByOptionId = async (req: Request, res: Response) => {
    const db = await getConnection();
    console.log(req.params.id);
    const productId = req.params.id;

    const rows = await db.all(`Select * from ProductOptions where productid =?`, [productId])

    if (rows.length === 0) {
        res.send({ msg: 'No data with this id', state: 500 })
    } else {
        res.send(rows);
    }


}


// 8. finds the specified product option for the specified product.
export const findOptionsByOptionId = async (req: Request, res: Response) => {

    console.log(req.params.id);
    const db = await getConnection();
    const id = req.params.id;
    const optionId = req.params.optionId;
    console.log('optionId', optionId)
    console.log('id', id)

    const rows = await db.all(`Select * from ProductOptions where id=? and productid =?`, [id, optionId]);
    if (rows.length === 0) {
        res.send({ msg: 'No data with this id', state: 500 })
    } else {
        res.send(rows);
    }

}

// 9. adds a new product option to the specified product.
export const addNewOptions = async (req: Request, res: Response) => {
    const db = await getConnection();
    const UUID_ProductID: string = req.params.id;
    const id: string = createUUID().toUpperCase();
    const productOptionInfo: types.productInfoType = req.body;

    // insert into ProductOptions table
    const rows = await db.run(`INSERT INTO ProductOptions VALUES (?,?,?,?)`, [id, UUID_ProductID, productOptionInfo.Name, productOptionInfo.Description])
    if (!rows) {
        res.send({ msg: 'No data with this id', state: 500 });
    } else {
        res.send(`Data inserted into ProductOption successfully`);
    }

}

// 10. updates the specified product option.
export const updateOptions = async (req: Request, res: Response) => {


    const db = await getConnection();
    const id: string = req.params.id;
    const optionId: string = req.params.optionId;
    const data: types.productOptionInfoType = req.body;


    const rows = await db.run(`UPDATE ProductOptions SET Name=?,  Description=? where ProductId=? and id=?`, [data.Name, data.Description, id, optionId])

    if (rows.changes === 0) {
        res.send({ msg: 'No data with this id', state: 500 });
    } else {
        res.send(`Data changed into ProductOption successfully`);
    }



}

// 11. deletes the specified product option.

export const deleteOptions = async (req: Request, res: Response) => {
    console.log(req.params.id)
    console.log(req.params.optionId);
    const db = await getConnection();
    const productId = req.params.id;
    const optionId = req.params.optionId;


    const rows = await db.run(`DELETE FROM ProductOptions where ProductId= ? and Id =?`, [productId, optionId]);
    console.log('rows', rows.changes)
    if (rows.changes === 0) {
        res.send({ msg: 'No data deleted with this id', state: 500 });
    } else {
        res.send('Data deleted successfully')
    }
}






// db.close((err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Close the database connection')
// })