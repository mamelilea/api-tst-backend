const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/',  async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// GET a product by ID
router.get('/:id',  async (req, res) => {
    const id = req.params.id;
    try {
        console.log("ID received:", id);
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        console.log("Query result:", rows);
        if (rows.length === 0) {
            console.log("No product found with ID:", id);
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST a new product
router.post('/',  async (req, res) => {
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
router.put('/:id',  async (req, res) => {
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
router.delete('/:id',  async (req, res) => {
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
