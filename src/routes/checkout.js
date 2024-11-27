const express = require('express');
const router = express.Router();
const connection = require('../database'); // Your database connection
const getCart = require('../getCart'); // Utility function for fetching the cart

// Promise wrapper for database queries
const query = (sql, params) =>
  new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

// Get the checkout page
router.get('/', async (req, res) => {
  const customerId = req.session?.user?.customer_id;
  if (!customerId) {
    return res.redirect('/account');
  }

  try {
    const cart = await getCart(customerId);
    res.render('checkout', { cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Failed to load checkout page');
  }
});

// Handle placing the order
router.post('/order', async (req, res) => {
  const customerId = req.session?.user?.customer_id;
  const { name, email,address, city, state, zip, payment_method } = req.body;

  if (!customerId) {
    return res.redirect('/account');
  }

  try {
    // Fetch the cart
    const cart = await getCart(customerId);
    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Insert the order
    const orderResult = await query(
      'INSERT INTO orders (customer_id, total_amount, payment_method, order_date) VALUES (?, ?, ?, NOW())',
      [customerId, totalAmount, payment_method]
    );
    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cart.items) {
      await query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id, item.quantity, item.price]
      );
    }

    // Render the order confirmation page
    res.render('order-confirmation', {
      orderId,
      orderDate: new Date().toLocaleString(),
      shippingDetails: { name, address, city, state, zip, payment_method },
      cartItems: cart.items,
      totalAmount,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Failed to place order');
  }
});

module.exports = router;
