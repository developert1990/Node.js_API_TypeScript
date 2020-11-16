import express, { Request, Response } from 'express';
import * as types from '../types';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { getConnection } from '../index';

import { getAllProductOption, createUUID } from '../commands/constants';


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
        // db.all(getAllProductOption, (err, row) => {
        //     res.send(row);
        // });
        const row = await db.all(getAllProductOption);
        // res.send(`${res.json({msg:'No data with this name', state:403})}`);
        res.send(`${res.json({ msg: 'No data with this name', state: 403 })}`)
    } else {
        // 2. finds all products matching the specified name.
        const name = req.query.name;
        const newName = name.toString().charAt(0).toUpperCase() + name.toString().slice(1);
        const rows = await db.all('select * from table', [newName])

        if (!rows) {
            // 이것도 웬만하면 json으로 돌려보내주는게 좋긴합니다 어차피 이걸 받는쪽도 그래야 쓰기가 편하거든요
            // 그리고 웬만하면 콜백대신 async/await 해주시는게 더 좋고요 ㅎㅎ
            res.send(`${res.json({ msg: 'No data with this name', state: 403 })}`);
        } else {
            res.send(rows);
        }


        // 요건 이 라이브러리 npm문서에 나오네요 사용법


    }

}

// 3. gets the project that matches the specified ID - ID is a GUID.

export const getProductByID = async (req: Request, res: Response) => {
    // console.log('req.params', req.params);
    const db = await getConnection();
    if (req.params.id !== undefined) {
        const id = req.params.id
        db.serialize();
        const { err, rows } = await db.get(`select * from ProductOptions where id = ?`, [id]);
        if (!rows) {
            res.send(`${res.send('No data with this ID')} ,${err?.message}`);
        } else {
            res.send(rows);
        }

    }
}


// 4. Creates a new product with POST method.

export const createProduct = async (req: Request, res: Response) => {
    console.log(req.body);

    const db = await getConnection();

    const productsInfo: types.productInfoType = req.body
    const UUID_ID: string = createUUID().toUpperCase();

    // insert into Products table
    const rows = await db.run(`INSERT INTO Products VALUES (?,?,?,?,?)`,
        [UUID_ID, productsInfo.Name, productsInfo.Description, productsInfo.Price, productsInfo.DeliveryPrice]);

    if (!rows) {
        res.send(res.json({ status: 403, msg: "Data can not be inserted" }))
    } else {
        console.log('Data inserted into Products successfully');
    }

    res.send('All data inserted Successfully')
}

// {
//     "Name": "Xiaomi Redmi 6",
//         "Description": "Newest mobile product from Xiaomi.",
//             "Price": 900.99,
//                 "DeliveryPrice": 8.99
// }



// 5. updates a product

export const updateProducts = async (req: Request, res: Response) => {

    console.log(req.params);
    console.log(req.body);
    const db = await getConnection();
    const id: string = req.params.id;
    const data: types.productInfoType = req.body;
    db.run(`UPDATE Products SET Name='${data.Name}', Description='${data.Description}', Price='${data.Price}', DeliveryPrice='${data.DeliveryPrice}' where Id='${id}'`, (err: { message: any; }) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Data inserted into ProductOption successfully');
        }
    });
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
    console.log(req.params.id);
    const db = await getConnection();
    const id: string = req.params.id;
    db.run(`DELETE FROM Products where Id= '${id}'`, (err: { message: any; }) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Data deleted successfully`);
        }
    });

    db.run(`DELETE FROM ProductOptions where ProductId= '${id}'`, (err: { message: any; }) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Data deleted successfully`);
        }
    });

    res.send(`Data deleted successfully`);
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
    const id = req.params.id;
    db.all(`Select * from ProductOptions where productid ='${id}'`, (err: { message: any; }, row: any) => {
        if (!row) {
            console.log(err?.message);
        } else {
            res.send(row);
        }
    });
}


// 8. finds the specified product option for the specified product.
export const findOptionsByOptionId = async (req: Request, res: Response) => {

    console.log(req.params.id);
    const db = await getConnection();
    const id = req.params.id;
    const optionId = req.params.optionId;
    console.log('optionId', optionId)
    console.log('id', id)
    db.all(`Select * from ProductOptions where productid ='${id}' and id='${optionId}'`, (err: { message: any; }, row: any) => {
        if (!row) {
            console.log(err?.message);
        } else {
            res.send(row);
        }
    });
}

// 9. adds a new product option to the specified product.
export const addNewOptions = async (req: Request, res: Response) => {
    console.log('뉴 옵션추가');
    const db = await getConnection();
    const UUID_ProductID: string = req.params.id;
    const id: string = createUUID().toUpperCase();
    const productOptionInfo: types.productInfoType = req.body;

    // insert into ProductOptions table
    db.run(`INSERT INTO ProductOptions VALUES ('${id}', '${UUID_ProductID}', '${productOptionInfo.Name}', '${productOptionInfo.Description}')`, (err: { message: any; }) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Data inserted into ProductOption successfully');
        }
    });
    res.send('Added specified options into ProductOptions table');
}

// 10. updates the specified product option.
export const updateOptions = async (req: Request, res: Response) => {


    console.log(req.params.id);
    console.log(req.params.optionId);
    const db = await getConnection();
    const id: string = req.params.id;
    const optionId: string = req.params.optionId;
    const data: types.productOptionInfoType = req.body;

    db.run(`UPDATE ProductOptions SET Name='${data.Name}', Name='${data.Name}',  Description='${data.Description}' where ProductId='${id}' and id='${optionId}'`, (err: { message: any; }) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Data inserted into ProductOption successfully');
        }
    });
    res.send('All options updated Successfully')

}

// 11. deletes the specified product option.

export const deleteOptions = async (req: Request, res: Response) => {
    console.log(req.params.id)
    console.log(req.params.optionId);
    const db = await getConnection();
    const productId = req.params.id;
    const optionId = req.params.optionId;

    db.run(`DELETE FROM ProductOptions where ProductId= '${productId}' and Id ='${optionId}'`, (err: { message: any; }) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Data deleted successfully`);
        }
    });

    res.send('All options deleted Successfully')
}






// db.close((err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Close the database connection')
// })