const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database-config');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const app = express();
// const port = 3005;
const PORT = process.env.PORT || 5769;
app.use(cors());

//===========================
app.use(bodyParser.json());
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Express Server API",
            version: "0.0.1",
            description: "A simple express api with swagger"
        },
     //   host: "reemkhalid2-app-40072ad251d5.herokuapp.com",
        basePath: '/',
        schemes: ['https']
    },
   // servers: [{ url: `https://reemkhalid2-app-40072ad251d5.herokuapp.com`}],
    apis: ['./server2.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products
 *     responses:
 *       200:
 *         description: A list of products
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Product'
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product
 *     parameters:
 *       - in: body
 *         name: product
 *         description: The product to create
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns a single product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 *   put:
 *     summary: Update a product
 *     description: Updates a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *       - in: body
 *         name: product
 *         description: The product to update
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *
 * /api/product/{id}/{name}:
 *   get:
 *     summary: Get a product by ID and name
 *     description: Returns a single product by ID and name
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the product
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *         description: The name of the product
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 *
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       ProductName:
 *         type: string
 *         example: product1
 *       ProductPrice:
 *         type: integer
 *         example: 10.5
 *       ProductDescription:
 *         type: string
 *         example: fruits
 *       CategoryID:
 *         type: integer
 *         example: 1
 *       ProductImage:
 *         type: string
 *         example: 'thepic.jpg'
 */
//================RESTful API ============================
// GET ALL
app.get('/api/product', async(req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Product");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/product/:id/:name', async(req, res) => {
    try {
        const { CategoryID, ProductName } = req.params;
        const result = await sql.query(`SELECT * FROM Product WHERE CategoryID= '${CategoryID}' and ProductName= '${ProductName}'`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//GET specific
app.get('/api/product/:id', async(req, res) => { //id == Param
    try {
        const { id } = req.params;
        const result = await sql.query (`SELECT * FROM Product WHERE ProductID='${id}'`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Insert
app.post('/api/product', async(req, res) => {
    try {
        const { ProductName, ProductPrice, ProductDescription, CategoryID , ProductImage} = req.body;
        const result = await sql.query(`Exec AddProduct_sp @ProductName='${ProductName}', @ProductPrice=${ProductPrice}, @ProductDescription='${ProductDescription}', @CategoryID='${CategoryID}', @ProductImage='${ProductImage}'`);
        res.status(201).json({ user: result.recordset, message: 'User has been created Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//update
app.put('/api/product/:id', async(req, res) => { //id == Param
    try {
        const { id } = req.params;
        const { ProductName, ProductPrice, ProductDescription, CategoryID , ProductImage} = req.body;
        const result = await sql.query(`UPDATE Product SET  ProductName='${ProductName}', ProductPrice='${ProductPrice}', ProductDescription='${ProductDescription}', CategoryID='${CategoryID}', ProductImage='${ProductImage}' WHERE ProductID='${id}'`);
        res.status(201).json({ user: result.recordset, message: 'User has been modified Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//delete
app.delete('/api/product/:id', async(req, res) => { //id == Param
    try {
        const { id } = req.params;
        const result = await sql.query(`DELETE FROM Product WHERE ProductID=${id}`);
        res.status(201).json({ user: result.recordset, message: 'User has been removed Successfully!' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
  //  console.log(`Server is running on https://reemkhalid2-app-40072ad251d5.herokuapp.com`);
  //  console.log(`Swagger UI is available on https://reemkhalid2-app-40072ad251d5.herokuapp.com/api-ui`);
});