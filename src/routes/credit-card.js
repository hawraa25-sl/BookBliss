// const express = require('express');
// const router = express.Router();
// const { query } = require('../query.js');

// // List of predefined fake credit cards for validation
// const fakeCreditCardList = [
//   '1234 5678 9012 3456',
//   '2345 6789 0123 4567',
//   '3456 7890 1234 5678',
//   '4567 8901 2345 6789',
//   // Add more as needed
// ];

// // Handle Checkout Order Submission
// router.post('/checkout/order', async (req, res) => {
//   const { payment_method, card_number, expiry_date, cvv, totalAmount, gift_card_number } = req.body;
//   const errors = [];

//   if (payment_method === 'Card') {
//     // Clean the card number to remove spaces
//     const cleanedCardNumber = card_number.replace(/\s+/g, '');

//     // Check if the card number is in the fake card list
//     if (!fakeCreditCardList.includes(cleanedCardNumber)) {
//       errors.push('Invalid card number or something went wrong with the payment.');
//     }

//     // Basic expiry date validation (check if it's in MM/YY format and not expired)
//     const currentDate = new Date();
//     const [month, year] = expiry_date.split('/').map(Number);
//     const expiryDate = new Date(20 + year, month - 1); // Month is 0-indexed
//     if (expiryDate < currentDate) {
//       errors.push('Card has expired.');
//     }

//     // Basic CVV validation (check if it's 3 or 4 digits)
//     if (!/^\d{3,4}$/.test(cvv)) {
//       errors.push('Invalid CVV.');
//     }

//     // If there are validation errors, re-render the checkout page with errors
//     if (errors.length > 0) {
//       return res.render('checkout', { error: errors.join(', ') });
//     }

//     // Insert the order into the database
//     try {
//       const orderResult = await query(`
//         INSERT INTO orders (customer_id, total_amount, payment_method, gift_card_id)
//         VALUES (?, ?, ?, ?)
//       `, [
//         req.session.user.customer_id,  // Assuming user session contains the customer_id
//         totalAmount,
//         payment_method,
//         gift_card_number ? gift_card_number : null  // If there's a gift card, include it
//       ]);

//       // If successful, show success message and order ID
//       res.render('checkout/success', {
//         order_id: orderResult.insertId,
//         message: 'Payment successful! Your order has been placed.'
//       });
//     } catch (err) {
//       console.error(err);
//       res.render('checkout', { error: 'An error occurred while processing your payment. Please try again later.' });
//     }
//   } else {
//     // Handle other payment methods (e.g., Cash on Delivery, Gift Card)
//     res.render('checkout', { error: 'Invalid payment method selected.' });
//   }
// });

// module.exports = router;


// // const express = require('express');
// // const router = express.Router();
// // const { query } = require('../query.js');

// // // Luhn Algorithm for card number validation
// // function validateCardNumber(cardNumber) {
// //   cardNumber = cardNumber.replace(/\s+/g, ''); // Remove spaces
// //   let sum = 0;
// //   let shouldDouble = false;

// //   for (let i = cardNumber.length - 1; i >= 0; i--) {
// //     let digit = parseInt(cardNumber[i], 10);

// //     if (shouldDouble) {
// //       digit *= 2;
// //       if (digit > 9) digit -= 9;
// //     }

// //     sum += digit;
// //     shouldDouble = !shouldDouble;
// //   }

// //   return sum % 10 === 0;
// // }

// // // Display credit card form
// // router.get('/', (req, res) => {
// //   if (!req.session?.user) return res.redirect('/account');
// //   res.render('account/credit-card', { customer: req.session.user });
  
// // });

// // // Handle form submission
// // router.post('/', async (req, res) => {
// //     const { cardholder_name, card_number, expiry_date, cvv } = req.body;
  
// //     const errors = [];
  
// //     // Validate card number
// //     if (!validateCardNumber(card_number)) {
// //       errors.push('Invalid card number.');
// //     }
  
// //     // Validate expiry date
// //     const currentDate = new Date();
// //     const [month, year] = expiry_date.split('/').map((el) => parseInt(el, 10));
// //     const expiryDate = new Date(20 + year, month - 1);  // Month is 0-indexed
// //     if (expiryDate < currentDate) {
// //       errors.push('Card has expired.');
// //     }
  
// //     // Validate CVV
// //     if (!/^\d{3,4}$/.test(cvv)) {
// //       errors.push('Invalid CVV.');
// //     }
  
// //     // If there are any errors, render the form with error messages
// //     if (errors.length > 0) {
// //       return res.render('account/credit-card', { errors, customer: req.session.user });
// //     }
  
// //     // Proceed to save the card if no errors
// //     try {
// //       const customerId = req.session.user.customer_id;
// //       await query(`
// //         INSERT INTO credit_cards (customer_id, cardholder_name, card_number, expiry_date, cvv)
// //         VALUES (?, ?, ?, ?, ?)
// //         ON DUPLICATE KEY UPDATE
// //           card_number = VALUES(card_number),
// //           expiry_date = VALUES(expiry_date),
// //           cvv = VALUES(cvv),
// //           cardholder_name = VALUES(cardholder_name)
// //       `, [customerId, cardholder_name, card_number.replace(/\s+/g, ''), expiry_date, cvv]);
  
// //       res.render('account/credit-card', { success: 'Credit card saved successfully!', customer: req.session.user });
// //     } catch (err) {
// //       console.error('Error saving credit card:', err);
// //       res.render('account/credit-card', { error: 'An error occurred. Please try again.', customer: req.session.user });
// //     }
// //   });
  

// // module.exports = router;
