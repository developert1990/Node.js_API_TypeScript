import { sum } from '../controllers/getData';

describe('testing functions', () => {
    test('sum() sould return sum of two numbers', () => {
        const result = sum(1, 2);
        expect(result).toEqual(3);
    })
})