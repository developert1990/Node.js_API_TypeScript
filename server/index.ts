import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import './controllers/getData';
import * as controllData from './controllers/getData';
import bodyParser from 'body-parser';
import { testValidator } from './middlewares';

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
app.post('/products', testValidator, controllData.createProduct);

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



// 여기 위에서 에러가 나면 그냥 return next(new Error('xxx')) 이렇게 넘겨주시고
// 그러면 요 밑에 에러핸들러가 받아서 에러 객체 리턴해요
// 이렇게 해주고 미들웨어쓰면됨

// 음 그런데 여기서 위에서 에러가 나면 아래 둘다 작동을 하는거에요...? 지금 위에 4번에 에러 핸들링하는 미들웨어를 
//줬잖아용? 네 이제 거기서 에러가 나면
// 다음함수로 넘기지않고 바로 next(new Error) 이렇게 했잖아요 그러면 익스프레스에서 지가 알아서 요 65번으로 넘겨줘요
// 그럼 67번에서 if (!err) 여기에 안걸리겠죠 에러가 있으니까 일단 
// 이해가시나영 네네 에러가 발생하면 여기로 넘어와서 

// 한개만 하겟죠 일단 에러나면 바로 밑에거만.. 
// general error handler

// 아 거기는 안해줘도되요 어차피 그게 마지막이라 더이성 next()부르지않으니까여 거기서 그냥 지금 여기 70번줄 뜻이
// 에러가 발생하지않으면 82번으로 넘어가란 뜻이에요여 네네 맞아여 그래서 미들웨어나 컨트롤러에서
// 만약에 에러가 났다 그러면 그냥 next(new Error)d 이렇게 하면 72번줄에 안걸리고 73번으로 바로 가는거에요

// 일단 이거 잘 알아두시고 그리고 미들웨어는 갯수재한이 없어요지금 29번째줄에 
// 미들웨어 한개 넣었잖아요 순서대로 여러게 넣을수도있어요 

// 일단 그렇게 쿼리 잘쓰는법이랑 미들웨어 활용해서 인풋 sanitisation/validation 하시고요
// 컨트롤러로 와보세용 겟데이터

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) return next();
    res.status(500).json({
        status: 'error',
        message: JSON.stringify(err),
    });
});

// 이건 만약에 /api/fjdklsafjklsa/fdsafdsa 이렇게 없는 라우트 불렸을때
// 그걸 핸들링하는거에요

// when no route is matching
app.use((req, res, next) => {
    res.status(404).json({
        message: 'route not found',
    })
});













app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${PORT}`);
})






export const getConnection = async () => {
    const db = await open({
        filename: 'C:/Temp/sqlite_practice/src/db/products.db',
        driver: sqlite3.Database,
    });
    return db;
}


