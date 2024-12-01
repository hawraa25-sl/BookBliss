const express = require('express');
const session = require('express-session');
const app = express()
const port = 3000
const path = require('path');


const { categoryList } = require('./constants');

 
app.use(express.json());
// Set the views directory
app.set('views', ['./views', './views/account']);  // Add './views/account' to search in both directories
 

// Set Pug as the view engine
app.set('views', './views');
app.set('view engine', 'pug')
app.use(express.static('public'));
console.log('Configured Views Directory:', app.get('views'));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));


app.use(function (req, res, next) {
  var _render = res.render;
  res.render = function (view, options, fn) {
    if (!options) options = {}
    Object.assign(options, { user: req?.session?.user });
    _render.call(this, view, options, fn);
  }
  next();
});
 

// Middleware to log the session for debugging

// Check session status route
app.use('/category', require('./routes/categoryRoutes'));
app.use('/search', require('./routes/searchRoutes'));
app.use('/book', require('./routes/bookRoutes'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/address', require('./routes/address'));
app.use('/shopNow', require('./routes/shopNow'));  
app.use('/account', require('./routes/accountRoutes'));
app.use('/admin', require('./routes/admin/adminRoutes'));
app.use('/admin', adminRoutes.router);
app.use(express.static(path.join(__dirname, 'public')));
 
const connection = require('./database')

// home
app.get('/', (req, res) => {
  res.render("home", {
    categories: categoryList,
  });
});

app.get('/books', (req, res) => {
  const query = 'SELECT * FROM Books';
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Error fetching books' });
    } else {
      res.render('books', {
        books: results
      })
    }
  });
})

app.get('/*', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
