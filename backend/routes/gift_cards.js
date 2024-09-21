const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Create a new gift card
  router.post('/', (req, res) => {
    const { code, balance, expiration_date } = req.body;
    const query = 'INSERT INTO gift_cards (code, balance, expiration_date) VALUES (?, ?, ?)';
    connection.query(query, [code, balance, expiration_date], (err, result) => {
      if (err) {
        console.error('Error creating gift card:', err);
        res.status(500).json({ error: 'Error creating gift card' });
      } else {
        res.status(201).json({ gift_card_id: result.insertId, message: 'Gift card created successfully' });
      }
    });
  });

  // Read all gift cards
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM gift_cards';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching gift cards' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Read a specific gift card
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM gift_cards WHERE gift_card_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching gift card' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Gift card not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

  // Update a gift card
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { code, balance, expiration_date } = req.body;
    const query = 'UPDATE gift_cards SET code = ?, balance = ?, expiration_date = ? WHERE gift_card_id = ?';
    connection.query(query, [code, balance, expiration_date, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error updating gift card' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Gift card not found' });
      } else {
        res.status(200).json({ message: 'Gift card updated successfully' });
      }
    });
  });

  // Delete a gift card
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM gift_cards WHERE gift_card_id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting gift card' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Gift card not found' });
      } else {
        res.status(200).json({ message: 'Gift card deleted successfully' });
      }
    });
  });

  return router;
};