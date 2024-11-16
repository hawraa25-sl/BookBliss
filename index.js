const express = require('express')
const mysql = require("mysql2")
const app = express()
const port = 3000

const config = require('./config');
const categoryRoutes = require('./routes/categoryRoutes');

app.set('views', './views');
app.set('view engine', 'pug')
app.use(express.static('public'));
app.use('/category', categoryRoutes);

// MySQL connection
const connection = mysql.createConnection(config.databaseUrl);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const descriptions = {
  'Personal Finance': 'Take control of your financial future with our personal finance book collection!',
  'Psychology': 'Dive into our psychology book collection and unlock the secrets of the mind!',
  'Romance': 'Fall in love with reading through our enchanting romance book collection!',
  'Self Help': 'Transform your life with our self-help collection!',
  'Horror': 'Explore the darkest corners of imagination with our horror collection!',
  'Others': 'Discover unique reads across various genres in our diverse collection!'
};

app.get('/', (req, res) => {
  const query = 'SELECT DISTINCT genre as category FROM books ORDER BY category';
  connection.query(query, (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).json({ error: 'Error fetching categories' });
      } else {
          res.render("home", {
              categories: results.map(result => result.Category),
              getCategoryDescription: (category) => descriptions[category] || 'Explore our collection!'
          });
      }
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

// app.get('/books')
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
