// /routes/admin/giftCardRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const config = require('../../config.json');
const {isAdmin} = require('./middleware.js');

const connection = mysql.createConnection(config.databaseUrl);

// Generate random 12-digit code
function generateGiftCardCode() {
    return Math.random().toString().slice(2, 14).padEnd(12, '0');
}

// Get all gift cards
router.get('/', isAdmin, (req, res) => {
    const query = `
        SELECT 
            g.*,
            CASE 
                WHEN g.is_redeemed = 1 THEN CONCAT(c.first_name, ' ', c.last_name)
                ELSE NULL
            END as redeemed_by,
            o.order_id as used_in_order
        FROM gift_cards g
        LEFT JOIN orders o ON g.gift_card_id = o.gift_card_id
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        ORDER BY g.expiry_date DESC
    `;

    connection.query(query, (err, giftCards) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving gift cards');
        }
        res.render('admin/gift-cards', { 
            giftCards,
            path: '/admin/gift-cards'
        });
    });
});

// Create new gift card
router.post('/create', isAdmin, (req, res) => {
    const { amount, expiry_date } = req.body;
    const code = generateGiftCardCode();

    connection.query('SELECT code FROM gift_cards WHERE code = ?', [code], (err, results) => {
        if (err) {
            console.error(err);
            return res.redirect('/admin/gift-cards?error=database_error');
        }

        if (results.length > 0) {
            return res.redirect('/admin/gift-cards?error=duplicate_code');
        }

        const query = `
            INSERT INTO gift_cards (code, amount, expiry_date, is_redeemed)
            VALUES (?, ?, ?, 0)
        `;

        connection.query(query, [code, amount, expiry_date], (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin/gift-cards?error=create_error');
            }
            res.redirect('/admin/gift-cards');
        });
    });
});

// Edit gift card
router.post('/edit/:id', isAdmin, (req, res) => {
    const { code, amount, expiry_date, is_redeemed } = req.body;
    
    connection.query(
        'SELECT code FROM gift_cards WHERE code = ? AND gift_card_id != ?', 
        [code, req.params.id], 
        (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin/gift-cards?error=database_error');
            }

            if (results.length > 0) {
                return res.redirect('/admin/gift-cards?error=duplicate_code');
            }

            const query = `
                UPDATE gift_cards 
                SET code = ?, amount = ?, expiry_date = ?, is_redeemed = ?
                WHERE gift_card_id = ?
            `;

            connection.query(query, 
                [code, amount, expiry_date, is_redeemed ? 1 : 0, req.params.id], 
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/admin/gift-cards?error=update_error');
                    }
                    res.redirect('/admin/gift-cards');
                }
            );
        }
    );
});

// Delete gift card
router.post('/delete/:id', isAdmin, (req, res) => {
    // First check if gift card is used in any order
    connection.query(
        'SELECT order_id FROM orders WHERE gift_card_id = ?',
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin/gift-cards?error=database_error');
            }

            if (results.length > 0) {
                return res.redirect('/admin/gift-cards?error=card_in_use');
            }

            // If not used, delete the gift card
            const query = 'DELETE FROM gift_cards WHERE gift_card_id = ?';
            connection.query(query, [req.params.id], (err) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/admin/gift-cards?error=delete_error');
                }
                res.redirect('/admin/gift-cards');
            });
        }
    );
});

module.exports = router;