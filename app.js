const express = require('express');
const { Op } = require('sequelize');  // **Import Sequelize.Op for search functionality**
const app = express();
const { Product } = require('./models'); // Import the Product model
app.use(express.json()); // Parse JSON bodies

// Create a new product (POST /products)
app.post('/products', async (req, res) => {
    try {
      const { name, price, description, category } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const newProduct = await Product.create({ name, price, description, category });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  });
  

// **Modified Get all products (GET /products) to include pagination and search**
app.get('/products', async (req, res) => {
    const { page = 1, limit = 10, name, category } = req.query;  // **Added page, limit, name, category to query parameters**
    const offset = (page - 1) * limit;  // **Pagination logic: Calculate offset**
    const where = {};  // **Where clause for search functionality**

    // **Search conditions**
    if (name) where.name = { [Op.like]: `%${name}%` };  // **Partial match on name**
    if (category) where.category = category;  // **Exact match on category**

    try {
      // **Get products with search and pagination applied**
      const products = await Product.findAndCountAll({
        where,        // **Apply search conditions**
        limit: parseInt(limit),  // **Pagination limit**
        offset: parseInt(offset),  // **Pagination offset**
      });

      // **Response with pagination metadata**
      res.status(200).json({
        totalItems: products.count,
        totalPages: Math.ceil(products.count / limit),
        currentPage: parseInt(page),
        data: products.rows,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  });
  

// Get a single product by ID (GET /products/:id)
app.get('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  });
  

// Update a product by ID (PUT /products/:id)
app.put('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const { name, price, description, category } = req.body;
      await product.update({ name, price, description, category });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  });
  

// Delete a product by ID (DELETE /products/:id)
app.delete('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  });
  

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
