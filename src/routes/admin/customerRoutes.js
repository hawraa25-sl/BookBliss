// /routes/admin/customerRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const {isAdmin} = require('./middleware.js')

const connection = mysql.createConnection(config.databaseUrl);

// Get all customers with their address count
router.get('/', isAdmin, (req, res) => {
    const query = `
        SELECT 
            c.*,
            a.address_id,
            a.city,
            a.street_name,
            a.building_name,
            a.floor_number,
            a.zipcode,
            a.details
        FROM customers c
        LEFT JOIN addresses a ON c.customer_id = a.customer_id
    `;

    connection.query(query, (err, customers) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving customers');
        }
        res.render('admin/customers', { 
            customers,
            path: '/admin/customers'
        });
    });
});

router.post('/edit/:id', isAdmin, (req, res) => {
    const customerId = req.params.id;
    const { first_name, last_name, email, phone_number, 
            city, street_name, building_name, floor_number, zipcode, details } = req.body;

    connection.beginTransaction(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error starting transaction');
        }

        // Update customer info
        const customerQuery = `
            UPDATE customers 
            SET first_name = ?, last_name = ?, email = ?, phone_number = ?
            WHERE customer_id = ?
        `;

        connection.query(customerQuery, 
            [first_name, last_name, email, phone_number, customerId],
            (err) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error(err);
                        res.status(500).send('Error updating customer');
                    });
                }

                // First check if address exists
                const checkAddressQuery = 'SELECT address_id FROM addresses WHERE customer_id = ?';
                connection.query(checkAddressQuery, [customerId], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error(err);
                            res.status(500).send('Error checking address existence');
                        });
                    }

                    let addressQuery;
                    let addressParams;

                    if (results.length > 0) {
                        // Update existing address
                        addressQuery = `
                            UPDATE addresses 
                            SET city = ?, street_name = ?, building_name = ?, 
                                floor_number = ?, zipcode = ?, details = ?
                            WHERE customer_id = ?
                        `;
                        addressParams = [city, street_name, building_name, 
                                      floor_number, zipcode, details, customerId];
                    } else {
                        // Insert new address
                        addressQuery = `
                            INSERT INTO addresses 
                            (customer_id, city, street_name, building_name, 
                             floor_number, zipcode, details)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                        addressParams = [customerId, city, street_name, building_name,
                                      floor_number, zipcode, details];
                    }

                    connection.query(addressQuery, addressParams, (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error(err);
                                res.status(500).send('Error updating address');
                            });
                        }

                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error(err);
                                    res.status(500).send('Error committing transaction');
                                });
                            }
                            res.redirect('/admin/customers');
                        });
                    });
                });
            }
        );
    });
});

router.post('/delete/:id', isAdmin, (req, res) => {
    connection.beginTransaction(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error starting transaction');
        }

        // First delete the address
        const deleteAddressQuery = 'DELETE FROM addresses WHERE customer_id = ?';
        connection.query(deleteAddressQuery, [req.params.id], (err) => {
            if (err) {
                return connection.rollback(() => {
                    console.error(err);
                    res.status(500).send('Error deleting customer address');
                });
            }

            // Then delete the customer
            const deleteCustomerQuery = 'DELETE FROM customers WHERE customer_id = ?';
            connection.query(deleteCustomerQuery, [req.params.id], (err) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error(err);
                        res.status(500).send('Error deleting customer');
                    });
                }

                connection.commit(err => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error(err);
                            res.status(500).send('Error committing transaction');
                        });
                    }
                    res.redirect('/admin/customers');
                });
            });
        });
    });
});

module.exports = router;