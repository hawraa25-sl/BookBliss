// /routes/admin/reviewRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const { isAdmin } = require('./middleware.js');

const connection = mysql.createConnection(config.databaseUrl);

// Get all reviews
router.get('/', isAdmin, (req, res) => {
    const query = `
        SELECT 
            r.review_id, 
            r.rating, 
            r.review_text, 
            r.review_date, 
            c.first_name AS customer_first_name, 
            c.last_name AS customer_last_name, 
            b.title AS book_title
        FROM reviews r
        INNER JOIN customers c ON r.customer_id = c.customer_id
        INNER JOIN books b ON r.book_id = b.book_id
        ORDER BY r.review_date DESC
    `;

    connection.query(query, (err, reviews) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving reviews');
        }
        res.render('admin/reviews', { 
            reviews,
            path: '/admin/reviews'
        });
    });
});

// Delete a review
router.post('/delete/:id', isAdmin, (req, res) => {
    const reviewId = req.params.id;

    const deleteReviewQuery = 'DELETE FROM reviews WHERE review_id = ?';
    connection.query(deleteReviewQuery, [reviewId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting review');
        }
        res.redirect('/admin/reviews');
    });
});

module.exports = router;
