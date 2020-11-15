Consider all aspects of good software engineering and show us how you'll make it #beautiful and make it a production ready code.

## Getting started for applicants

Use this https://www.npmjs.com/package/sqlite and https://www.npmjs.com/package/sqlite3 for db operations.
```
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
 
// this is a top-level await 
(async () => {
    // open the database
    const db = await open({
      filename: '/tmp/database.db',
      driver: sqlite3.Database
    })
    await db.get('SELECT * FROM ...');
})()
```

There should be these endpoints:

1. `GET /products` - gets all products.
2. `GET /products?name={name}` - finds all products matching the specified name.
3. `GET /products/{id}` - gets the project that matches the specified ID - ID is a GUID.
4. `POST /products` - creates a new product.
5. `PUT /products/{id}` - updates a product.
6. `DELETE /products/{id}` - deletes a product and its options.
7. `GET /products/{id}/options` - finds all options for a specified product.
8. `GET /products/{id}/options/{optionId}` - finds the specified product option for the specified product.
9. `POST /products/{id}/options` - adds a new product option to the specified product.
10. `PUT /products/{id}/options/{optionId}` - updates the specified product option.
11. `DELETE /products/{id}/options/{optionId}` - deletes the specified product option.

All models are specified in the `/Models` folder, but should conform to:

**Product:**
```
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "Product name",
  "description": "Product description",
  "price": 123.45,
  "deliveryPrice": 12.34
}
```

**Products:**
```
{
  "items": [
    {
      // product
    },
    {
      // product
    }
  ]
}
```

**Product Option:**
```
{
  "id": "01234567-89ab-cdef-0123-456789abcdef",
  "name": "Product name",
  "description": "Product description"
}
```

**Product Options:**
```
{
  "items": [
    {
      // product option
    },
    {
      // product option
    }
  ]
}
```
