const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// GET a product by ID
// Di productRoutes.js
// productRoutes.js
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Karena ID adalah char(36) UUID, gunakan query yang tepat
        console.log("Executing query for ID:", id);
        const [rows] = await db.query(
            'SELECT * FROM products WHERE id = ? COLLATE utf8mb4_general_ci',
            [id]
        );
        console.log("Query executed with ID:", id);
        console.log("Query result:", rows);

        if (rows.length === 0) {
            console.log("No product found with ID:", id);
            return res.status(404).json({ 
                message: "Product not found",
                requestedId: id 
            });
        }

        // Pastikan data yang dikembalikan sesuai dengan yang diharapkan frontend
        const product = {
            id: rows[0].id,
            name: rows[0].name,
            description: rows[0].description,
            price: rows[0].price,
            stock: rows[0].stock,
            category: rows[0].category,
            image_url: rows[0].image_url
        };

        console.log("Returning product data:", product);
        res.json(product);
    } catch (err) {
        console.error("Error in GET /:id:", err);
        res.status(500).json({ 
            message: "Internal server error",
            error: err.message 
        });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    const { name, description, price, stock, category, image_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, category, image_url]
        );
        const newProduct = {
            id: result.insertId,
            name,
            description,
            price,
            stock,
            category,
            image_url
        };
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: 'Error adding product' });
    }
});


// PUT update a product by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category, image_url } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE id = ?',
            [name, description, price, stock, category, image_url, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ id, name, description, price, stock, category, image_url });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
