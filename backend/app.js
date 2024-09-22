const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const connection = mysql.createConnection(config.databaseUrl);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Import and use the routers
const booksRouter = require('./routes/books')(connection);
const customersRouter = require('./routes/customers')(connection);
const ordersRouter = require('./routes/orders')(connection);
const orderItemsRouter = require('./routes/order_items')(connection);
const reviewsRouter = require('./routes/reviews')(connection);
const adminRouter = require('./routes/admin')(connection);
const addressesRouter = require('./routes/addresses')(connection);
const giftCardsRouter = require('./routes/gift_cards')(connection);
const cartsRouter = require('./routes/carts')(connection);
const cartItemsRouter = require('./routes/cart_items')(connection);

app.use('/books', booksRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/order-items', orderItemsRouter);
app.use('/reviews', reviewsRouter);
app.use('/admin', adminRouter);
app.use('/addresses', addressesRouter);
app.use('/gift-cards', giftCardsRouter);
app.use('/carts', cartsRouter);
app.use('/cart-items', cartItemsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});