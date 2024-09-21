const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new cart item
  router.post('/', (req, res) => {
    const { cart_id, book_id, quantity } = req.body;
    const query = 'INSERT INTO cart_items (cart_id, book_id, quantity) VALUES (?, ?, ?)';
    connection.query(query, [cart_id, book_id, quantity], (err, result) => {
      if (err) {
        console.error('Error creating cart item:', err);
        res.status(500).json({ error: 'Error creating cart item' });
      } else {
        res.status(201).json({ cart_item_id: result.insertId, message: 'Cart item created successfully' });
      }
    });
  });

  // Read all cart items
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM cart_items';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching cart items' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific cart item
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM cart_items WHERE cart_item_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching cart item' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Cart item not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update a cart item
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { cart_id, book_id, quantity } = req.body;
    const query = 'UPDATE cart_items SET cart_id = ?, book_id = ?, quantity = ? WHERE cart_item_id = ?';
    connection.query(query, [cart_id, book_id, quantity, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating cart item' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Cart item not found' });
      } else {
        res.status(200).json({ message: 'Cart item updated successfully' });
      }
    });
  });

  // Delete a cart item
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM cart_items WHERE cart_item_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting cart item' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Cart item not found' });
      } else {
        res.status(200).json({ message: 'Cart item deleted successfully' });
      }
    });
  });

  return router;
};