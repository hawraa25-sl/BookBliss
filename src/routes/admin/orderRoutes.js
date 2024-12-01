// /routes/admin/orderRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const {isAdmin} = require('./middleware.js')

const connection = mysql.createConnection(config.databaseUrl);

// Get all orders with their items
router.get('/', isAdmin, (req, res) => {
    const query = `
        SELECT 
            o.*,
            CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            c.email as customer_email,
            g.code as gift_card_code
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN gift_cards g ON o.gift_card_id = g.gift_card_id
        ORDER BY o.order_date DESC
    `;

    const itemsQuery = `
        SELECT 
            oi.*,
            b.title as book_title,
            b.author as book_author
        FROM order_items oi
        JOIN books b ON oi.book_id = b.book_id
        WHERE oi.order_id = ?
    `;

    connection.query(query, (err, orders) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving orders');
        }

        // Get items for each order
        const orderPromises = orders.map(order => {
            return new Promise((resolve, reject) => {
                connection.query(itemsQuery, [order.order_id], (err, items) => {
                    if (err) {
                        reject(err);
                    } else {
                        order.items = items;
                        resolve(order);
                    }
                });
            });
        });

        Promise.all(orderPromises)
            .then(ordersWithItems => {
                res.render('admin/orders', { 
                    orders: ordersWithItems,
                    path: '/admin/orders'
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error retrieving order items');
            });
    });
});

// Update order status
router.post('/edit/:id', isAdmin, (req, res) => {
    const orderId = req.params.id;
    const { payment_method, items } = req.body;

    connection.beginTransaction(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error starting transaction');
        }

        // Update order payment method
        const orderQuery = `
            UPDATE orders 
            SET payment_method = ?
            WHERE order_id = ?
        `;

        connection.query(orderQuery, [payment_method, orderId], (err) => {
            if (err) {
                return connection.rollback(() => {
                    console.error(err);
                    res.status(500).send('Error updating order');
                });
            }

            // Update order items
            const itemPromises = Object.entries(items).map(([itemId, quantity]) => {
                return new Promise((resolve, reject) => {
                    const itemQuery = `
                        UPDATE order_items 
                        SET quantity = ?
                        WHERE order_item_id = ? AND order_id = ?
                    `;
                    connection.query(itemQuery, [quantity, itemId, orderId], err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            Promise.all(itemPromises)
                .then(() => {
                    // Recalculate total amount
                    const totalQuery = `
                        UPDATE orders o
                        SET total_amount = (
                            SELECT SUM(oi.quantity * oi.price)
                            FROM order_items oi
                            WHERE oi.order_id = ?
                        )
                        WHERE o.order_id = ?
                    `;

                    connection.query(totalQuery, [orderId, orderId], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error(err);
                                res.status(500).send('Error updating total amount');
                            });
                        }

                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error(err);
                                    res.status(500).send('Error committing transaction');
                                });
                            }
                            res.redirect('/admin/orders');
                        });
                    });
                })
                .catch(err => {
                    connection.rollback(() => {
                        console.error(err);
                        res.status(500).send('Error updating order items');
                    });
                });
        });
    });
});

module.exports = router;