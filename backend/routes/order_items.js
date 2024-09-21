const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new order item
  router.post('/', (req, res) => {
    const { order_id, book_id, quantity, price } = req.body;
    const query = 'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)';
    connection.query(query, [order_id, book_id, quantity, price], (err, result) => {
      if (err) {
        console.error('Error creating order item:', err);
        res.status(500).json({ error: 'Error creating order item' });
      } else {
        res.status(201).json({ order_item_id: result.insertId, message: 'Order item created successfully' });
      }
    });
  });

  // Read all order items
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM order_items';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching order items' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific order item
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM order_items WHERE order_item_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching order item' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Order item not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update an order item
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { order_id, book_id, quantity, price } = req.body;
    const query = 'UPDATE order_items SET order_id = ?, book_id = ?, quantity = ?, price = ? WHERE order_item_id = ?';
    connection.query(query, [order_id, book_id, quantity, price, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating order item' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order item not found' });
      } else {
        res.status(200).json({ message: 'Order item updated successfully' });
      }
    });
  });

  // Delete an order item
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM order_items WHERE order_item_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting order item' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order item not found' });
      } else {
        res.status(200).json({ message: 'Order item deleted successfully' });
      }
    });
  });

  return router;
};