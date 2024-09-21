const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new admin
  router.post('/', (req, res) => {
    const { username, password, email, first_name, last_name } = req.body;
    const query = 'INSERT INTO admin (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [username, password, email, first_name, last_name], (err, result) => {
      if (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ error: 'Error creating admin' });
      } else {
        res.status(201).json({ admin_id: result.insertId, message: 'Admin created successfully' });
      }
    });
  });

  // Read all admins
  router.get('/', (req, res) => {
    const query = 'SELECT admin_id, username, email, first_name, last_name FROM admin';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching admins' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific admin
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT admin_id, username, email, first_name, last_name FROM admin WHERE admin_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching admin' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Admin not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update an admin
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name } = req.body;
    const query = 'UPDATE admin SET username = ?, email = ?, first_name = ?, last_name = ? WHERE admin_id = ?';
    connection.query(query, [username, email, first_name, last_name, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating admin' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Admin not found' });
      } else {
        res.status(200).json({ message: 'Admin updated successfully' });
      }
    });
  });

  // Delete an admin
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM admin WHERE admin_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting admin' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Admin not found' });
      } else {
        res.status(200).json({ message: 'Admin deleted successfully' });
      }
    });
  });

  return router;
};