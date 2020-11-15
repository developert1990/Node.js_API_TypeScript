import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import './controllers/getData';
import * as controllData from './controllers/getData';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8001;
app.use(cors());
// body-parser를 사용하지 않으면 post 방식으로 body를 보낼때 req.body 로 undefined가 나오기때문에 사용한다. 하지만 최신버전의 express는 body-parser가 built in 되어있기 때문에 따로 이렇게 해줄필요는 없다.
// app.use(bodyParser.json())

// 이렇게 하면 built in 된 body-parser의 역할을 수행할수가 있다.
app.use(express.json());
// app.get('/', (req, res) => {
//     res.send('Express + TypeScript Server');
// });
app.get('/', controllData.connect);
// 1. gets all products , // 2. finds all products matching the specified name.
app.get('/products', controllData.getAllProducts);

// 3. gets the project that matches the specified ID - ID is a GUID.
app.get('/products/:id', controllData.getProductByID);

// 4. Creates a new product with POST method.
app.post('/products', controllData.createProduct);

// 5. updates a product
app.put('/products/:id', controllData.updateProducts);

// 6. delete a product and its options
app.delete('/products/:id', controllData.deleteProductAndOptions);


// 7. finds all options for a specified product.
app.get('/products/:id/options', controllData.findAllOptionsByOptionId);

// 8. finds the specified product option for the specified product.
app.get('/products/:id/options/:optionId', controllData.findOptionsByOptionId);

// 9. adds a new product option to the specified product.
app.post('/products/:id/options', controllData.addNewOptions);

// 10. updates the specified product option.
app.put('/products/:id/options/:optionId', controllData.updateOptions)

// 11. deletes the specified product option.
app.delete('/products/:id/options/:optionId', controllData.deleteOptions);

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${PORT}`);
})




// (async () => {
//     const db = await open({
//         filename: 'C:/Temp/sqlite_practice/src/db/products.db',
//         driver: sqlite3.Database,
//     });


//     const result = await db.all(`select * from Productoptions where name = 'White'`);
//     console.log(result);


// }
// )();

