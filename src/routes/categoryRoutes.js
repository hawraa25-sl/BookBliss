const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const config = require('../config');

// MySQL connection
const connection = mysql.createConnection(config.databaseUrl);

// Route to show books in a specific category
router.get('/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName

    const query = 'SELECT * FROM books WHERE genre = ?';
    connection.query(query, [categoryName], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error fetching books in category' });
        } else {
            res.render('category', {
                categoryName: categoryName,
                books: results
            });
        }
    });
});
// app.get('/genre', (req, res) => {
//     console.log("Category route hit!");  // Debugging log to confirm the route is being hit

//     const genres = [
//         { genreName: "Fiction", description: "Description for fiction" },
//         { genreName: "Romance", description: "Description for romance" }
//     ];

//     res.render('category', { genres: genres });
// });



module.exports = router;