require('dotenv').config();

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // your MySQL password
  database: process.env.DB_NAME, // your DB name
});


// const db = mysql.createPool({
//   host: 'srv1750.hstgr.io',
//   user: 'u550074487_baby',
//   password: 'Mdzo19@ec', // your MySQL password
//   database: 'u550074487_baby', // your DB name
// });



(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to MySQL Database');
    connection.release();
  } catch (err) {
    console.error('❌ Error connecting to the database:', err.message);
  }
})();

module.exports = db;