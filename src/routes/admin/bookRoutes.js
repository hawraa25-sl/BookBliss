// /routes/admin/bookRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const adminRoutes = require('./adminRoutes');
const isAdmin = adminRoutes.isAdmin;

const connection = mysql.createConnection(config.databaseUrl);

// Books CRUD
router.get('/', isAdmin, (req, res) => {
    const query = 'SELECT * FROM books';
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving books');
        }
        res.render('admin/books', { 
            books: results,
            path: '/admin/books'
        });
    });
});


router.post('/add', isAdmin, (req, res) => {
    const { title, author, genre, isbn, price, stock, published_date, description, cover_image_url } = req.body;
    const query = `
        INSERT INTO books (title, author, genre, isbn, price, stock, published_date, description, cover_image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.query(query, 
        [title, author, genre, isbn, price, stock, published_date, description, cover_image_url],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error adding book');
            }
            res.redirect('/admin/books');
        }
    );
});

router.post('/edit/:id', isAdmin, (req, res) => {
    const { title, author, genre, isbn, price, stock, published_date, description, cover_image_url } = req.body;
    const query = `
        UPDATE books 
        SET title=?, author=?, genre=?, isbn=?, price=?, stock=?, published_date=?, description=?, cover_image_url=?
        WHERE book_id=?
    `;
    
    connection.query(query, 
        [title, author, genre, isbn, price, stock, published_date, description, cover_image_url, req.params.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating book');
            }
            res.redirect('/admin/books');
        }
    );
});

router.post('/delete/:id', isAdmin, (req, res) => {
    const query = 'DELETE FROM books WHERE book_id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting book');
        }
        res.redirect('/admin/books');
    });
});

module.exports = router;