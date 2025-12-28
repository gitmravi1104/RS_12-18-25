const mysql = require('mysql2');

const db2 = mysql.createPool({
  host: '194.238.17.64',
  user: 'ramanasoft', // Add your database user
  password: 'Ramanasoft@123', // Add your database password
  database: 'qtresults',
});

// Test the database connection
db2.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Database Connected Successfully');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db2;

