const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new review
  router.post('/', (req, res) => {
    const { book_id, customer_id, rating, review_text, review_date } = req.body;
    const query = 'INSERT INTO reviews (book_id, customer_id, rating, review_text, review_date) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [book_id, customer_id, rating, review_text, review_date], (err, result) => {
      if (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ error: 'Error creating review' });
      } else {
        res.status(201).json({ review_id: result.insertId, message: 'Review created successfully' });
      }
    });
  });

  // Read all reviews
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM reviews';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching reviews' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific review
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM reviews WHERE review_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching review' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Review not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update a review
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { book_id, customer_id, rating, review_text, review_date } = req.body;
    const query = 'UPDATE reviews SET book_id = ?, customer_id = ?, rating = ?, review_text = ?, review_date = ? WHERE review_id = ?';
    connection.query(query, [book_id, customer_id, rating, review_text, review_date, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating review' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Review not found' });
      } else {
        res.status(200).json({ message: 'Review updated successfully' });
      }
    });
  });

  // Delete a review
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM reviews WHERE review_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting review' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Review not found' });
      } else {
        res.status(200).json({ message: 'Review deleted successfully' });
      }
    });
  });

  return router;
};