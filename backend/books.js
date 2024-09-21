const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new book
  router.post('/', (req, res) => {
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
  router.get('/', (req, res) => {
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
  router.get('/:id', (req, res) => {
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
  router.put('/:id', (req, res) => {
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
  router.delete('/:id', (req, res) => {
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

  return router;
};