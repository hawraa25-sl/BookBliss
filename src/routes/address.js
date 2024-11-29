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
    console.log(results[0])
    res.render('account', { customer: results[0] });
  });
});

router.post('/', (req, res) => {
  const customerId = req.session?.user?.customer_id;

  // Ensure the session contains a valid customerId
  if (!customerId) {
    return res.status(401).send('Unauthorized: No customer session found.');
  }

  const { city,  streetName, buildingName, floorNumber,zipcode, details } = req.body;

  // Ensure all fields are provided
  if (!city   || !streetName || !buildingName || !floorNumber || !details) {
    return res.render('account', { error: 'Ensure all fields are provided' });
  }

  // Check if the address already exists
  const selectQuery = `
    SELECT * FROM addresses
    WHERE customer_id = ?
  `;
  const selectValues = [customerId, city,   streetName, buildingName, floorNumber,zipcode, details];

  connection.query(selectQuery, selectValues, (selectErr, results) => {
    if (selectErr) {
      console.error('Error checking address existence:', selectErr.message);
      return res.status(500).send('Error checking address existence.');
    }

    // If address exists, delete it
    if (results.length > 0) {
      const deleteQuery = `
        DELETE FROM addresses
        WHERE customer_id = ?
      `;
      connection.query(deleteQuery, selectValues, (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting existing address:', deleteErr.message);
          return res.status(500).send('Error deleting existing address.');
        }

        console.log('Existing address deleted successfully.');
        // Insert the new address
        insertAddress();
      });
    } else {
      // If address doesn't exist, directly insert it
      insertAddress();
    }
  });

  // Function to insert the new address
  const insertAddress = () => {
    const insertQuery = `
      INSERT INTO addresses (customer_id, city,   street_name, building_name, floor_number, zipcode, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [customerId, city, streetName, buildingName, floorNumber,zipcode, details];

    connection.query(insertQuery, insertValues, (err) => {
      if (err) {
        console.error('Error saving address:', err.message);
        return res.status(500).send('Error saving address.');
      }

      console.log('Address saved successfully for customer:', customerId);

      // Send a success message to the view
      res.render('account', {
        successMessage: 'Address saved successfully!',
        user: req.session.user,
      });
    });
  };
});




module.exports = router;
