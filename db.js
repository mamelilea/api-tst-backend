const mysql = require('mysql2/promise');

let connection;

async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000
    });
  }
  return connection;
}

module.exports = {
  query: async (sql, params) => {
    const conn = await getConnection();
    return conn.execute(sql, params);
  }
};