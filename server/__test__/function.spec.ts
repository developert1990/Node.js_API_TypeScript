import * as types from '../types';

// 이렇게 설정하면 현재 디렉토리의 .env 파일을 자동으로 인식해서 환경변수를 사용할 수 있게 한다.
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';


describe('testing functions', () => {


    test('should create and return an data with a status of 200', async () => {
        const result_01 = await axios.get(`${process.env.LOCAL_URL}/products`);
        console.log('result1: ', result_01.data);
        expect(result_01.status).toEqual(200);

        const result_02 = await axios.get(`${process.env.LOCAL_URL}/products?name=White`);
        console.log('result2: ', result_02.data);
        expect(result_02.status).toEqual(200);

    });




})










// expect(result.data).toEqual(
//     [
//         {
//             Id: '0643CCF0-AB00-4862-B3C5-40E2731ABCC9',
//             ProductId: '8F2E9176-35EE-4F0A-AE55-83023D2DB1A3',
//             Name: 'White',
//             Description: 'White Samsung Galaxy S7'
//         },
//         {
//             Id: 'A21D5777-A655-4020-B431-624BB331E9A2',
//             ProductId: '8F2E9176-35EE-4F0A-AE55-83023D2DB1A3',
//             Name: 'Black',
//             Description: 'Black Samsung Galaxy S7'
//         },
//         {
//             Id: '5C2996AB-54AD-4999-92D2-89245682D534',
//             ProductId: 'DE1287C0-4B15-4A7B-9D8A-DD21B3CAFEC3',
//             Name: 'Rose Gold',
//             Description: 'Gold Apple iPhone 6S'
//         },
//         {
//             Id: '9AE6F477-A010-4EC9-B6A8-92A85D6C5F03',
//             ProductId: 'DE1287C0-4B15-4A7B-9D8A-DD21B3CAFEC3',
//             Name: 'White',
//             Description: 'White Apple iPhone 6S'
//         },
//         {
//             Id: '4E2BC5F2-699A-4C42-802E-CE4B4D2AC0EF',
//             ProductId: 'DE1287C0-4B15-4A7B-9D8A-DD21B3CAFEC3',
//             Name: 'Black',
//             Description: 'Black Apple iPhone 6S'
//         },
//         {
//             Id: '49E9CF36-C7D0-4FCF-AE93-48CD1BBA2A1F',
//             ProductId: '8181BF9F-8F39-4036-94A1-819683ADCAED',
//             Name: 'Red',
//             Description: 'Google pixel S6'
//         },
//         {
//             Id: '7845AFC1-C616-4A64-8523-6411FFD4BB42',
//             ProductId: 'C79FEBF6-25E9-471A-8213-F4B2E4045D03',
//             Name: 'Blue',
//             Description: 'Blue Xiomi Redmi 6'
//         }
//     ]
// );