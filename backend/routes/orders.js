const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new order
  router.post('/', (req, res) => {
    const { customer_id, order_date, total_amount, status } = req.body;
    const query = 'INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES (?, ?, ?, ?)';
    connection.query(query, [customer_id, order_date, total_amount, status], (err, result) => {
      if (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Error creating order' });
      } else {
        res.status(201).json({ order_id: result.insertId, message: 'Order created successfully' });
      }
    });
  });

  // Read all orders
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM orders';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching orders' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific order
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM orders WHERE order_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching order' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update an order
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { customer_id, order_date, total_amount, status } = req.body;
    const query = 'UPDATE orders SET customer_id = ?, order_date = ?, total_amount = ?, status = ? WHERE order_id = ?';
    connection.query(query, [customer_id, order_date, total_amount, status, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating order' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json({ message: 'Order updated successfully' });
      }
    });
  });

  // Delete an order
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM orders WHERE order_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting order' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.status(200).json({ message: 'Order deleted successfully' });
      }
    });
  });

  return router;
};