import express, { Request, Response } from 'express';
import * as types from '../types';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { getAllProductOption, createUUID } from '../commands/constants';


const app = express();
app.use(express.json());


export const sum = (a: number, b: number) => {
    return a + b;
}





// open DB
let db = new sqlite3.Database('./data/products.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the mydb database.');
    }
});





export const connect = (req: Request, res: Response) => {
    res.send('DB and Server are connected');
}


export const getAllProducts = (req: Request, res: Response) => {

    db.serialize();
    console.log('req name: ', req.query.name)
    if (req.query.name === undefined) {
        // 1. gets all products
        db.all(getAllProductOption, (err, row) => {
            res.send(row);
        });
    } else {
        // 2. finds all products matching the specified name.
        const name = req.query.name;
        const newName = name.toString().charAt(0).toUpperCase() + name.toString().slice(1);
        console.log(newName)
        db.all(`select * from Productoptions where name = '${newName}'`, (err, row) => {
            if (!row) {
                res.send(`${res.send('No data with this name')} ,${err?.message}`);
            } else {
                res.send(row);
            }
        });
    }

}

// 3. gets the project that matches the specified ID - ID is a GUID.

export const getProductByID = async (req: Request, res: Response) => {
    console.log('req.params', req.params);
    if (req.params.id !== undefined) {
        const id = req.params.id
        db.serialize();
        db.get(`select * from ProductOptions where id = '${id}'`, (err, row) => {
            if (!row) {
                console.log('데이터없음')
                res.send(`${res.send('No data with this ID')} ,${err?.message}`);
            } else {
                console.log('데이터 있음')
                res.send(row);
            }
        })
    }
}


// 4. Creates a new product with POST method.

export const createProduct = async (req: Request, res: Response) => {
    console.log(req.body);
    const productsInfo: types.productInfoType = req.body
    const UUID_ID: string = createUUID().toUpperCase();


    // insert into Products table
    db.run(`INSERT INTO Products VALUES ('${UUID_ID}', '${productsInfo.Name}', '${productsInfo.Description}', ${productsInfo.Price}, ${productsInfo.DeliveryPrice})`, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Data inserted into Products successfully');
        }
    });



    res.send('All data inserted Successfully')
}

// {
//     "Name": "Xiaomi Redmi 6",
//         "Description": "Newest mobile product from Xiaomi.",
//             "Price": 900.99,
//                 "DeliveryPrice": 8.99
// }



// 5. updates a product

export const updateProducts = (req: Request, res: Response) => {

    console.log(req.params);
    console.log(req.body);
    const id: string = req.params.id;
    const data: types.productInfoType = req.body;
    db.run(`UPDATE Products SET Name='${data.Name}', Description='${data.Description}', Price='${data.Price}', DeliveryPrice='${data.DeliveryPrice}' where Id='${id}'`, (err) => {
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

export const deleteProductAndOptions = (req: Request, res: Response) => {
    console.log(req.params.id);
    const id: string = req.params.id;
    db.run(`DELETE FROM Products where Id= '${id}'`, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Data deleted successfully`);
        }
    });

    db.run(`DELETE FROM ProductOptions where ProductId= '${id}'`, (err) => {
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

export const findAllOptionsByOptionId = (req: Request, res: Response) => {

    console.log(req.params.id);
    const id = req.params.id;
    db.all(`Select * from ProductOptions where productid ='${id}'`, (err, row) => {
        if (!row) {
            console.log(err?.message);
        } else {
            res.send(row);
        }
    });
}


// 8. finds the specified product option for the specified product.
export const findOptionsByOptionId = (req: Request, res: Response) => {

    console.log(req.params.id);
    const id = req.params.id;
    const optionId = req.params.optionId;
    console.log('optionId', optionId)
    console.log('id', id)
    db.all(`Select * from ProductOptions where productid ='${id}' and id='${optionId}'`, (err, row) => {
        if (!row) {
            console.log(err?.message);
        } else {
            res.send(row);
        }
    });
}

// 9. adds a new product option to the specified product.
export const addNewOptions = (req: Request, res: Response) => {
    console.log('뉴 옵션추가');

    const UUID_ProductID: string = req.params.id;
    const id: string = createUUID().toUpperCase();
    const productOptionInfo: types.productInfoType = req.body;

    // insert into ProductOptions table
    db.run(`INSERT INTO ProductOptions VALUES ('${id}', '${UUID_ProductID}', '${productOptionInfo.Name}', '${productOptionInfo.Description}')`, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Data inserted into ProductOption successfully');
        }
    });
    res.send('Added specified options into ProductOptions table');
}

// 10. updates the specified product option.
export const updateOptions = (req: Request, res: Response) => {


    console.log(req.params.id);
    console.log(req.params.optionId);

    const id: string = req.params.id;
    const optionId: string = req.params.optionId;
    const data: types.productOptionInfoType = req.body;

    db.run(`UPDATE ProductOptions SET Name='${data.Name}', Name='${data.Name}',  Description='${data.Description}' where ProductId='${id}' and id='${optionId}'`, (err) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Data inserted into ProductOption successfully');
        }
    });
    res.send('All options updated Successfully')

}

// 11. deletes the specified product option.

export const deleteOptions = (req: Request, res: Response) => {
    console.log(req.params.id)
    console.log(req.params.optionId);
    const productId = req.params.id;
    const optionId = req.params.optionId;

    db.run(`DELETE FROM ProductOptions where ProductId= '${productId}' and Id ='${optionId}'`, (err) => {
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