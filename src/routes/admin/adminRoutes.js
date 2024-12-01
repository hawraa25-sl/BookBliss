// /routes/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');

const connection = mysql.createConnection(config.databaseUrl);

// Middleware to check if user is admin - define before requiring route files
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Make middleware available for other routes
module.exports.isAdmin = isAdmin;

// Require routes AFTER exporting isAdmin
const bookRoutes = require('./bookRoutes');
const customerRoutes = require('./customerRoutes');

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

// Redirect dashboard to books
router.get('/dashboard', isAdmin, (req, res) => {
    res.redirect('/admin/books');
});

// Default admin route redirects to books
router.get('/', isAdmin, (req, res) => {
    res.redirect('/admin/books');
});

// Use the separate route files
router.use('/books', bookRoutes);
router.use('/customers', customerRoutes);

module.exports.router = router;