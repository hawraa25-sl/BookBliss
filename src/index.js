const express = require('express')
const session = require('express-session');
const app = express()
const port = 3000

const { categoryList } = require('./constants');

app.use(express.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'pug')
app.use(express.static('public'));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(function (req, res, next) {
  var _render = res.render;
  res.render = function (view, options, fn) {
    if (!options) options = {}
    Object.assign(options, { user: req?.session?.user });
    _render.call(this, view, options, fn);
  }
  next();
});

app.use('/category', require('./routes/categoryRoutes'));
app.use('/search', require('./routes/searchRoutes'));
app.use('/book', require('./routes/bookRoutes'));
app.use('/cart', require('./routes/cart'));

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

app.get('/account', (req, res) => {
  res.render('account')
})

// Handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  connection.query('SELECT * FROM customers WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.render('account', { error: 'Unknown error occured' });
    }
    if (results.length === 0) {
      return res.render('account', { error: "Customer not found" });
    }

    const user = results[0];
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password_hash;

    if (isPasswordValid) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.render('account', { error: 'Invalid password' });
    }

  });
});

app.post('/create-account', (req, res) => {
  // Destructure incoming data from the form
  const { first_name, last_name, email, phone_number, password } = req.body;

  // Ensure all fields are provided
  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.render('account', { error: 'Ensure all fields are provided' })
  }

  // SQL query to insert the new customer into the database
  const query = `
    INSERT INTO customers (first_name, last_name, email, phone_number, password_hash)
    VALUES (?, ?, ?, ?, ?);
  `;

  // Execute the query
  connection.query(query, [first_name, last_name, email, phone_number, password], (err, result) => {
    if (err) {
      console.error(err)
      return res.render('account', { error: "Unknown error occured" })
    }

    res.redirect('/');
  });

});

// Logout route to destroy the session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});


app.get('/admin', (req, res) => {
  res.send("This is the admin page<br>Under construction")
})

app.get('/*', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
 
