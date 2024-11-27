const express = require('express');
const router = express.Router();
const connection = require('../database');  // Adjust if needed

// Route to fetch and display all books
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Books';  // Replace with your actual query
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching books' });
    }
    // Render the shopNow.pug template and pass the books data
    res.render('shopNow', { books: results });
  });
});

module.exports = router;

  