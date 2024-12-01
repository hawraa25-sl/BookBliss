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
            res.render('book', { 
                book: bookResults[0],
                reviews: reviewResults,
                user: req.user
            });
        });
    });
});
router.post('/:id/review', (req, res) => {
    const bookId = req.params.id;
    const { customer_id, rating, review_text } = req.body;

    // Validate input
    if (!customer_id || !rating || rating < 1 || rating > 5 || !review_text) {
        return res.status(400).send('Invalid input: Ensure all fields are filled and rating is between 1 and 5.');
    }

    const query = `
        INSERT INTO reviews (book_id, customer_id, rating, review_text, review_date)
        VALUES (?, ?, ?, ?, NOW())
    `;

    connection.query(query, [bookId, customer_id, rating, review_text], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding review');
        }

        // Redirect back to the book details page
        res.redirect(`/books/${bookId}`);
    });
});

module.exports = router;