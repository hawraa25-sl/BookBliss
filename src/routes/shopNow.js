const express = require('express');
const router = express.Router();
const connection = require('../database');

// Route to fetch and display all books
router.get('/', (req, res) => {
  const query = 'SELECT * FROM books';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching books' });
    }
    res.render('shopNow', { books: results });
  });
});

module.exports = router;

  