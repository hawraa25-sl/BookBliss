const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new customer
  router.post('/', (req, res) => {
    const { first_name, last_name, email, phone_number } = req.body;
    const query = 'INSERT INTO customers (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)';
    connection.query(query, [first_name, last_name, email, phone_number], (err, result) => {
      if (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ error: 'Error creating customer' });
      } else {
        res.status(201).json({ customer_id: result.insertId, message: 'Customer created successfully' });
      }
    });
  });

  // Read all customers
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM customers';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching customers' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific customer
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM customers WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching customer' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Customer not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update a customer
  // For the backend -> phone
  // for the database --> phone_number
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;
    const query = 'UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE customer_id = ?';
    connection.query(query, [first_name, last_name, email, phone, id], (err, result) => {
      if (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: 'Error updating customer' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Customer not found' });
      } else {
        res.status(200).json({ message: 'Customer updated successfully' });
      }
    });
  });

  // Delete a customer
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM customers WHERE customer_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'Error deleting customer' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Customer not found' });
      } else {
        res.status(200).json({ message: 'Customer deleted successfully' });
      }
    });
  });

  return router;
};