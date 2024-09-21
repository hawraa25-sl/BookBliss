const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new cart
  router.post('/', (req, res) => {
    const { customer_id, created_at } = req.body;
    const query = 'INSERT INTO carts (customer_id, created_at) VALUES (?, ?)';
    connection.query(query, [customer_id, created_at], (err, result) => {
      if (err) {
        console.error('Error creating cart:', err);
        res.status(500).json({ error: 'Error creating cart' });
      } else {
        res.status(201).json({ cart_id: result.insertId, message: 'Cart created successfully' });
      }
    });
  });

  // Read all carts
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM carts';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching carts' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific cart
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM carts WHERE cart_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching cart' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Cart not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update a cart
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { customer_id, created_at } = req.body;
    const query = 'UPDATE carts SET customer_id = ?, created_at = ? WHERE cart_id = ?';
    connection.query(query, [customer_id, created_at, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating cart' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Cart not found' });
      } else {
        res.status(200).json({ message: 'Cart updated successfully' });
      }
    });
  });

  // Delete a cart
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM carts WHERE cart_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting cart' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Cart not found' });
      } else {
        res.status(200).json({ message: 'Cart deleted successfully' });
      }
    });
  });

  return router;
};