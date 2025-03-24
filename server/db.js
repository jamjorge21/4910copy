const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Your MySQL username
  password: 'Bru39025no!.',  // Your MySQL password
  database: 'consultation_shop' // Your database name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

module.exports = connection;
