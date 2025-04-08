const fs = require('fs');
const https = require('https');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Read SSL certificates
const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bru39025no!.',
  database: 'consultation_shop'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Route to handle order submission
app.post('/submit-order', (req, res) => {
  const { first_name, last_name, email, service, price, card_number, expiration_date, zip_code, cvv } = req.body;

  console.log('Received order data:', req.body);  // Log the received order data

  // Validate that all required fields are present
  if (!first_name || !last_name || !email || !service || !price || !card_number || !expiration_date || !zip_code || !cvv) {
    console.error('Missing required fields');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Log data types to ensure they are as expected
  console.log('Data Types:', {
    first_name: typeof first_name,
    last_name: typeof last_name,
    email: typeof email,
    service: typeof service,
    price: typeof price,
    card_number: typeof card_number,
    expiration_date: typeof expiration_date,
    zip_code: typeof zip_code,
    cvv: typeof cvv,
  });

  // Ensure the expiration date is in the correct format (YYYY-MM-DD)
  let formattedExpirationDate = expiration_date;
  if (formattedExpirationDate && formattedExpirationDate.length === 7) {
    formattedExpirationDate += '-01';  // Add the day (set it to '01' to make it a valid date)
  }

  const query = 'INSERT INTO orders (first_name, last_name, email, service, price, card_number, expiration_date, zip_code, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [first_name, last_name, email, service, price, card_number, formattedExpirationDate, zip_code, cvv], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);  // Log any error that occurs
      return res.status(500).json({ error: 'Failed to submit order' });
    }

    console.log('Order inserted successfully, ID:', result.insertId);  // Log the inserted order ID
    res.status(200).json({ message: 'Order submitted successfully', orderId: result.insertId });
  });
});

// Create HTTPS server
https.createServer(credentials, app).listen(3000, () => {
  console.log('Server is running on https://localhost:3000');
});
