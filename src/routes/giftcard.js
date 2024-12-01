const express = require('express');
const router = express.Router();
const { query } = require('../query.js');

// Gift cards page
router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/account');
    res.render('account/giftcard');
});

// Generate a random gift card code
function generateGiftCardCode() {
    return Math.random().toString(36).substr(2, 12).toUpperCase(); // Generates an 12-character alphanumeric code
}

// Handle "Buy Gift Card" form submission
router.post('/buy', async (req, res) => {
    const { amount } = req.body; // Retrieve the amount from the form
    const giftCardCode = generateGiftCardCode(); // Generate a unique gift card code

    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.render('account/giftcard', { error: 'Invalid amount.' });
    }

    try {
        const insertGCResult = await query(`
            INSERT INTO gift_cards (code, amount, expiry_date, is_redeemed)
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 YEAR), 0)
        `, [giftCardCode, parseFloat(amount)]); // Insert the new gift card into the database

        // Send success message
        res.render('account/giftcard', {
            message: `Gift card created with code: ${giftCardCode} and amount: $${parseFloat(amount).toFixed(2)}`
        });
    } catch (err) {
        console.error(err);

        // Handle unique constraint errors (e.g., duplicate gift card code)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.render('account/giftcard', { error: 'Failed to create gift card. Please try again.' });
        }

        // General error handling
        return res.render('account/giftcard', { error: 'An unexpected error occurred. Please try again.' });
    }
});

module.exports = router;
