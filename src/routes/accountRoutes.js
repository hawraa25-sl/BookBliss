const express = require('express');
const router = express.Router();
const connection = require('../database');

// Main account management page
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.render('account'); // Shows login page if not logged in
  }
  
  const successMessage = req.session.successMessage;
  delete req.session.successMessage; // Clear the message after retrieving it
  
  res.render('account/account-management', { successMessage });
});

// Change name page
router.get('/name', (req, res) => {
  if (!req.session.user) return res.redirect('/account');
  res.render('account/update-name');
});

// Update name handler
router.post('/update-name', (req, res) => {
  if (!req.session.user) return res.redirect('/account');

  const { first_name, last_name } = req.body;
  const customerId = req.session.user.customer_id;

  if (!first_name || !last_name) {
    return res.render('account/update-name', { error: 'Both first and last name are required' });
  }

  const updateQuery = `
    UPDATE customers 
    SET first_name = ?, last_name = ?
    WHERE customer_id = ?
  `;

  connection.query(updateQuery, [first_name, last_name, customerId], (err, result) => {
    if (err) {
      console.error('Error updating name:', err);
      return res.render('account/update-name', { error: 'Error updating name' });
    }

    // Update session user data
    req.session.user.first_name = first_name;
    req.session.user.last_name = last_name;
    
    req.session.successMessage = 'Name updated successfully!';
    res.redirect('/account');
  });
});

// Change password page
router.get('/password', (req, res) => {
  if (!req.session.user) return res.redirect('/account');
  res.render('account/update-password');
});

// Update password handler
router.post('/update-password', (req, res) => {
  if (!req.session.user) return res.redirect('/account');

  const { current_password, new_password, confirm_password } = req.body;
  const customerId = req.session.user.customer_id;

  if (!current_password || !new_password || !confirm_password) {
    return res.render('account/update-password', { error: 'All fields are required' });
  }

  if (new_password !== confirm_password) {
    return res.render('account/update-password', { error: 'New passwords do not match' });
  }

  // Verify current password using SHA2-256
  const verifyQuery = `
    SELECT password_hash FROM customers 
    WHERE customer_id = ? AND password_hash = SHA2(?, 256)
  `;

  connection.query(verifyQuery, [customerId, current_password], (err, results) => {
    if (err) {
      console.error('Error verifying password:', err);
      return res.render('account/update-password', { error: 'Error updating password' });
    }

    if (results.length === 0) {
      return res.render('account/update-password', { error: 'Current password is incorrect' });
    }

    // Update password with new SHA2-256 hash
    const updateQuery = `
      UPDATE customers 
      SET password_hash = SHA2(?, 256)
      WHERE customer_id = ?
    `;

    connection.query(updateQuery, [new_password, customerId], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.render('account/update-password', { error: 'Error updating password' });
      }

      req.session.successMessage = 'Password updated successfully!';
      res.redirect('/account');
    });
  });
});

// Address page
router.get('/address', (req, res) => {
  const customerId = req.session?.user?.customer_id;

  if (!customerId) {
    return res.redirect('/account');
  }

  const query = `
    SELECT customers.first_name, customers.last_name, addresses.*
    FROM customers
    LEFT JOIN addresses ON customers.customer_id = addresses.customer_id
    WHERE customers.customer_id = ?
  `;

  connection.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching address:', err.message);
      return res.status(500).send('Error fetching address.');
    }

    res.render('account/address', { 
      customer: results[0] || req.session.user,
      addressData: results[0]
    });
  });
});

// Login handler
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Using SHA2-256 for password verification
  const query = `
    SELECT * FROM customers 
    WHERE email = ? AND password_hash = SHA2(?, 256)
  `;

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.render('account', { error: 'Unknown error occurred' });
    }
    if (results.length === 0) {
      return res.render('account', { error: "Invalid email or password" });
    }

    const user = results[0];
    req.session.user = user;
    res.redirect('/');
  });
});


// Create account handler
router.post('/create', (req, res) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.render('account', { error: 'All fields are required' });
  }

  // Check if email already exists
  connection.query('SELECT * FROM customers WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.render('account', { error: 'Unknown error occurred' });
    }

    if (results.length > 0) {
      return res.render('account', { error: 'Email already exists' });
    }

    // Insert new user with SHA2-256 hashed password
    const query = `
      INSERT INTO customers (first_name, last_name, email, phone_number, password_hash)
      VALUES (?, ?, ?, ?, SHA2(?, 256));
    `;

    connection.query(query, [first_name, last_name, email, phone_number, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.render('account', { error: "Unknown error occurred" });
      }

      // Log the user in after successful registration
      const loginQuery = `SELECT * FROM customers WHERE email = ? AND password_hash = SHA2(?, 256)`;
      connection.query(loginQuery, [email, password], (err, results) => {
        if (err || results.length === 0) {
          return res.redirect('/account');
        }
        req.session.user = results[0];
        res.redirect('/account');
      });
    });
  });
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

module.exports = router;