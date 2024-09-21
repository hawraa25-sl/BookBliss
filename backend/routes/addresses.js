const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new address
  router.post('/', (req, res) => {
    const { customer_id, address_line1, address_line2, city, state, postal_code, country } = req.body;
    const query = 'INSERT INTO addresses (customer_id, address_line1, address_line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [customer_id, address_line1, address_line2, city, state, postal_code, country], (err, result) => {
      if (err) {
        console.error('Error creating address:', err);
        res.status(500).json({ error: 'Error creating address' });
      } else {
        res.status(201).json({ address_id: result.insertId, message: 'Address created successfully' });
      }
    });
  });

  // Read all addresses
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM addresses';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching addresses' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific address
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM addresses WHERE address_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching address' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Address not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update an address
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { customer_id, address_line1, address_line2, city, state, postal_code, country } = req.body;
    const query = 'UPDATE addresses SET customer_id = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE address_id = ?';
    connection.query(query, [customer_id, address_line1, address_line2, city, state, postal_code, country, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating address' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Address not found' });
      } else {
        res.status(200).json({ message: 'Address updated successfully' });
      }
    });
  });

  // Delete an address
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM addresses WHERE address_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting address' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Address not found' });
      } else {
        res.status(200).json({ message: 'Address deleted successfully' });
      }
    });
  });

  return router;
};