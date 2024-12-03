require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
  });
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});