// /routes/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const { isAdmin } = require('./middleware');
const connection = mysql.createConnection(config.databaseUrl);

router.use('/books', require('./bookRoutes'));
router.use('/customers', require('./customerRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/gift-cards', require('./giftCardRoutes'));

// Default admin route redirects to books
router.get('/', isAdmin, (req, res) => {
    res.redirect('/admin/books');
});

// Admin Login Routes
router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM admin WHERE email = ? AND password_hash = SHA2(?, 256)';
    
    connection.query(query, [email, password], (err, results) => {
        if (err || results.length === 0) {
            return res.render('admin/login', { error: 'Invalid credentials' });
        }
        req.session.isAdmin = true;
        res.redirect('/admin/books');
    });
});


module.exports = router;