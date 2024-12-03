const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Register Admin
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if username already exists
        const [existingAdmin] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Attempt to insert
        const [result] = await db.query('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hashedPassword]);
        
        // Log the result to see what's happening
        console.log('Insert result:', result);

        res.status(201).json({ 
            message: 'Admin registered successfully',
            insertId: result.insertId 
        });
    } catch (error) {
        console.error("Detailed Error registering admin:", error);
        res.status(500).json({ 
            message: 'Error registering admin',
            errorDetails: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});


// Login Admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [admin] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (admin.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', admin: { id: admin[0].id, username: admin[0].username } });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;