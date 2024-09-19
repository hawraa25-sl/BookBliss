const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection(
  'mysql://root:@127.0.0.1:3306/bookbliss'
);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// CRUD operations

// Create a new book
app.post('/books', (req, res) => {
  const { title, author, genre, isbn, stock, price, published_date } = req.body;
  const query = 'INSERT INTO books (title, author, genre, isbn, stock, price, published_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [title, author, genre, isbn, stock, price, published_date], (err, result) => {
    if (err) {
      console.error('Error creating book:', err);
      res.status(500).json({ error: 'Error creating book' });
    } else {
      res.status(201).json({ id: result.insertId, message: 'Book created successfully' });
    }
  });
});

// Read all books
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching books' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Read a specific book
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching book' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Update a book
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, published_year } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, published_year = ? WHERE id = ?';
  connection.query(query, [title, author, published_year, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating book' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book updated successfully' });
    }
  });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting book' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});