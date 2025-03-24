const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path'); // For serving static files
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bru39025no!.',  // Make sure your password is correct
  database: 'consultation_shop'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Route to handle order submission
app.post('/submit-order', (req, res) => {
  const { first_name, last_name, email, service, price } = req.body;

  // Log the incoming request to see what data is being received
  console.log('Received order data:', req.body);

  // Validate that all required fields are present
  if (!first_name || !last_name || !email || !service || !price) {
    console.log('Missing fields in the request.');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Insert the order into the database
  const query = 'INSERT INTO orders (first_name, last_name, email, service, price) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [first_name, last_name, email, service, price], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);  // Log any database errors
      return res.status(500).json({ error: 'Failed to submit order' });
    }

    console.log('Order submitted successfully:', result);
    res.status(200).json({ message: 'Order submitted successfully', orderId: result.insertId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
