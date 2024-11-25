const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../config.json');
const connection = mysql.createConnection(config.databaseUrl);

// Route to display or manage the address
// /address
router.get('/', (req, res) => {
  const customerId = req.session?.user?.customer_id;

  // Ensure the session contains a valid customerId
  if (!customerId) {
    return res.redirect('/account');
  }

  const query = `
    SELECT customers.first_name, customers.last_name, addresses.*
    FROM customers
    JOIN addresses ON customers.customer_id = addresses.customer_id
    WHERE customers.customer_id = ?
  `;

  connection.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching address:', err.message);
      return res.status(500).send('Error fetching address.');
    }

    if (results.length === 0) {
      // If no address is found, show the address form with a message
      return res.status(404).send('No address found for this customer.');
    }

    // Render the address page and pass the results to the view
    res.render('account', { customer: results[0] });
  });
});

router.post('/', (req, res) => {
  const customerId = req.session?.user?.customer_id;

  // Ensure the session contains a valid customerId
  if (!customerId) {
    return res.status(401).send('Unauthorized: No customer session found.');
  }

  const { city, zipcode, streetName, buildingName, floorNumber, details } = req.body;

  if (!city || !zipcode || !streetName || !buildingName || !floorNumber || !details) {
    return res.render('account', { error: 'Ensure all fields are provided' });
  }

  // Address doesn't exist, insert it
  const insertQuery = `
    INSERT INTO addresses (customer_id, city, zipcode, street_name, building_name, floor_number, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const insertValues = [customerId, city, zipcode, streetName, buildingName, floorNumber, details];

  connection.query(insertQuery, insertValues, (err) => {
    if (err) {
      console.error('Error saving address:', err.message);
      return res.status(500).send('Error saving address.');
    }

    // Log success message to console
    console.log('Address saved successfully for customer:', customerId);

    // Send a success message to the view
    res.render('account', { 
      successMessage: 'Address saved successfully!', 
      user: req.session.user 
    });

    // Redirect after displaying the success message
    setTimeout(() => {
      res.redirect('/');  // Redirect to homepage after 3 seconds
    }, 3000);  // 3000 milliseconds (3 seconds)
  });
});



module.exports = router;
