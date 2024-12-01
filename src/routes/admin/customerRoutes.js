// /routes/admin/customerRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const adminRoutes = require('./adminRoutes');
const isAdmin = adminRoutes.isAdmin;

const connection = mysql.createConnection(config.databaseUrl);

// Get all customers with their address count
router.get('/', isAdmin, (req, res) => {
    const query = `
        SELECT 
            c.*, 
            COUNT(a.address_id) as address_count
        FROM customers c
        LEFT JOIN addresses a ON c.customer_id = a.customer_id
        GROUP BY c.customer_id
    `;

    connection.query(query, (err, customers) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving customers');
        }
        
        // Rest of your customer route logic...
        res.render('admin/customers', { 
            customers,
            path: '/admin/customers'
        });
    });
});

// Update customer and addresses
router.post('/customers/edit/:id', isAdmin, (req, res) => {
    const customerId = req.params.id;
    const { first_name, last_name, email, phone_number, addresses } = req.body;

    // Start a transaction
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

                // Handle addresses
                const addressPromises = addresses.map(addr => {
                    if (addr.address_id) {
                        // Update existing address
                        return new Promise((resolve, reject) => {
                            connection.query(
                                `UPDATE addresses 
                                SET city = ?, street_name = ?, building_name = ?, 
                                    floor_number = ?, zipcode = ?, details = ?
                                WHERE address_id = ? AND customer_id = ?`,
                                [addr.city, addr.street_name, addr.building_name, 
                                 addr.floor_number, addr.zipcode, addr.details, 
                                 addr.address_id, customerId],
                                err => err ? reject(err) : resolve()
                            );
                        });
                    } else {
                        // Insert new address
                        return new Promise((resolve, reject) => {
                            connection.query(
                                `INSERT INTO addresses 
                                (customer_id, city, street_name, building_name, 
                                 floor_number, zipcode, details)
                                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                                [customerId, addr.city, addr.street_name, addr.building_name,
                                 addr.floor_number, addr.zipcode, addr.details],
                                err => err ? reject(err) : resolve()
                            );
                        });
                    }
                });

                Promise.all(addressPromises)
                    .then(() => {
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error(err);
                                    res.status(500).send('Error committing transaction');
                                });
                            }
                            res.redirect('/admin/customers');
                        });
                    })
                    .catch(err => {
                        connection.rollback(() => {
                            console.error(err);
                            res.status(500).send('Error updating addresses');
                        });
                    });
            }
        );
    });
});

// Delete customer (will cascade delete addresses due to FK constraint)
router.post('/customers/delete/:id', isAdmin, (req, res) => {
    const query = 'DELETE FROM customers WHERE customer_id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting customer');
        }
        res.redirect('/admin/customers');
    });
});

module.exports = router;