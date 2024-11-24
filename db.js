const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db-tst',
    port: 3306
});

module.exports = pool.promise();