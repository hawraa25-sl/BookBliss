// search.js
const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const config = require('../config.json');

// MySQL connection
const connection = mysql.createConnection(config.databaseUrl);

// Handle search from navbar
router.get('/', (req, res) => {
    const searchQuery = req.query.q; // Get search query from URL parameter

    if (!searchQuery) {
        res.redirect('/'); // Redirect to home if no search query
        return;
    }

    // Search in books table across multiple fields
    const query = `
        SELECT * FROM books 
        WHERE title LIKE ? 
        OR author LIKE ? 
        OR genre LIKE ?
        OR description LIKE ?

    `;
    
    const searchParam = `%${searchQuery}%`;
    const params = [searchParam, searchParam, searchParam, searchParam, searchParam];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error searching books' });
        } else {
            res.render('searchResults', {
                searchQuery: searchQuery,
                books: results
            });
        }
    });
});

module.exports = router;