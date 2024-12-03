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

  const { city, steet_name, building_name, floor_number, zipcode, payment_method } = req.body;

  if (!customerId) {
    return res.redirect('/account');
  }

  let cart
  try {
    // Fetch the cart
    cart = await getCart(customerId);
    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    let validateGCResult
    // Check for gift card number
    if (req.body.gift_card_number) {
      validateGCResult = await query(
        'SELECT * FROM gift_cards WHERE code = ?',
        [req.body.gift_card_number]
      )


      if (validateGCResult.length != 1) {
        throw "Invalid Gift card code"
      }

      const amount = validateGCResult[0]?.amount
      const is_redeemed = validateGCResult[0]?.is_redeemed
      
      if (is_redeemed || amount < totalAmount) {
        
        throw "Insufficient Gift card amount"
      }

      await query(
        'UPDATE gift_cards SET is_redeemed = 1 WHERE code = ?',
        [req.body.gift_card_number]
      )
    }

    // Insert the order
    const orderResult = await query(
      'INSERT INTO orders (customer_id, total_amount, payment_method, gift_card_id) VALUES (?, ?, ?, ?)',
      [customerId, totalAmount, payment_method, validateGCResult[0].gift_card_id]
    );
    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cart.items) {
      await query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id, item.quantity, item.price]
      );
    }
    // Reduce Book Stock
    for (const item of cart.items) {
      await query(
        'UPDATE books SET stock = stock - ? where book_id = ?',
        [item.quantity, item.book_id]
      );
    }

    await query(`
      DELETE cart_items
      FROM cart_items
      INNER JOIN carts ON cart_items.cart_id = carts.cart_id
      WHERE carts.customer_id = ?
      `, [customerId]);

    await query(
      'DELETE FROM carts WHERE customer_id = ?',
      [customerId]
    );
    // Render the order confirmation page
    res.render('order-confirmation', {
      orderId,
      orderDate: new Date().toLocaleString(),
      shippingDetails: { city, steet_name, building_name, floor_number, zipcode, payment_method },
      cartItems: cart.items,
      totalAmount,
    });
  } catch (error) {
    res.render('checkout', { cart, error: `Error placing order: ${error}`})
  }
});

module.exports = router;
