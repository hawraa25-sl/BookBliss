const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const config = require('../config.json');
const { categoryList } = require('../constants');

// MySQL connection
const connection = mysql.createConnection(config.databaseUrl);

// Route to show books in a specific category
router.get('/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName
    const categoryObj = categoryList.find(cat => cat.name === categoryName);

    const query = 'SELECT * FROM books WHERE genre = ?';
    connection.query(query, [categoryName], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error fetching books in category' });
        } else {
            res.render('category', {
                categoryName: categoryName,
                books: results,
                categoryDescription: categoryObj.description
            });
        }
    });
});

module.exports = router;