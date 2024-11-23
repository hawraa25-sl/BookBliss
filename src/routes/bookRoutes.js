const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config.json');

const connection = mysql.createConnection(config.databaseUrl);


router.get('/:id', (req, res) => {
    const bookQuery = `
        SELECT books.*
        FROM books 
        WHERE books.book_id = ?`;

    const reviewsQuery = `
        SELECT reviews.*, CONCAT(customers.first_name, ' ', customers.last_name) as reviewer_name
        FROM reviews
        JOIN customers ON reviews.customer_id = customers.customer_id
        WHERE reviews.book_id = ?
        ORDER BY reviews.review_date DESC`;

    connection.query(bookQuery, [req.params.id], (err, bookResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving book details');
        }
        if (bookResults.length === 0) {
            return res.status(404).send('Book not found');
        }

        connection.query(reviewsQuery, [req.params.id], (err, reviewResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving reviews');
            }

            console.log(bookResults)

            res.render('book', { 
                book: bookResults[0],
                reviews: reviewResults
            });
        });
    });
});

module.exports = router;