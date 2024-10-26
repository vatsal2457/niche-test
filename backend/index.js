// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL Database
const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',      // Your database host
  user: 'sql12740826',                    // Your database username
  password: 'vVITsqs9pN',                 // Your database password
  database: 'sql12740826',                // Your database name
  port: 3306                               // Default MySQL port
});

// Establish MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Routes
app.use('/tasks', require('./routes/tasks')(db)); // Pass `db` connection to task routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
