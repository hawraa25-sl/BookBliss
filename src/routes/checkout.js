const express = require('express');
const router = express.Router();

const getCart = require('../getCart');

router.get('/', async (req, res) => {
    const customerId = req.session?.user?.customer_id;
    if (!customerId) {
        return res.redirect('/account')
    }
    res.render('checkout', { cart: await getCart(customerId) })
});

router.post('/order', (req, res) => {
    
})

module.exports = router;