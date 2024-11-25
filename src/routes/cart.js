const express = require('express');
const router = express.Router();

const connection = require('../database');
const getCart = require('../getCart');

router.get('/', async (req, res) => {
    const customerId = req.session?.user?.customer_id; // Assuming customer_id is stored in session

    if (!customerId) {
        return res.redirect('/account')
    }

    try {
        const cart = await getCart(customerId)
        console.log(cart)
        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the cart');
    }
});

// Route to handle adding a book to the cart
router.post('/add', async (req, res) => {
    const bookId = req.body.book_id; // Getting the book ID from the form submission
    const customerId = req.session?.user?.customer_id; // Assuming customer_id is stored in session

    console.log(bookId)

    if (!customerId) {
        return res.redirect('/account')
    }

    let carts;
    try {
        carts = await new Promise(resolve => {
            connection.query('SELECT * FROM carts WHERE customer_id = ?', [customerId], (err, rows) => {
                if (err) {
                    return res.status(500).send();
                }
                resolve(rows);
            });
        });
    } catch {
        return res.status(500).send();
    }

    let cartId;
    if (carts.length === 0) {
        try {
            cartId = await new Promise(resolve => {
                connection.query('INSERT INTO carts (customer_id) VALUES (?)', [customerId], (err, result) => {
                    if (err) {
                        return res.status(500).send();
                    }
                    resolve(result.insertId);
                });
            });
        } catch {
            return res.status(500).send();
        }
    } else {
        cartId = carts[0].cart_id; // Fix the column name to match the schema
    }

    try {
        // Check if the book is already in the cart
        const existingItem = await new Promise(resolve => {
            connection.query('SELECT * FROM cart_items WHERE cart_id = ? AND book_id = ?', [cartId, bookId], (err, rows) => {
                if (err) {
                    return res.status(500).send();
                }
                resolve(rows);
            });
        });

        if (existingItem.length > 0) {
            // If the book is already in the cart, update the quantity
            await new Promise(resolve => {
                connection.query('UPDATE cart_items SET quantity = quantity + 1 WHERE cart_item_id = ?', [existingItem[0].cart_item_id], (err) => {
                    if (err) {
                        return res.status(500).send();
                    }
                    resolve();
                });
            });
        } else {
            // If the book is not in the cart, add it
            const book = await new Promise(resolve => {
                connection.query('SELECT price FROM books WHERE book_id = ?', [bookId], (err, rows) => {
                    if (err) {
                        return res.status(500).send();
                    }
                    resolve(rows);
                });
            });

            console.log(book)

            if (book.length > 0) {
                await new Promise(resolve => {
                    connection.query(
                        'INSERT INTO cart_items (cart_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
                        [cartId, bookId, 1, book[0].price],
                        (err) => {
                            if (err) {
                                return res.status(500).send();
                            }
                            resolve();
                        }
                    );
                });
            } else {
                return res.status(400).send('Book not found');
            }
        }

        res.redirect('/cart'); // Redirect to the cart page
    } catch {
        return res.status(500).send();
    }
});

module.exports = router;