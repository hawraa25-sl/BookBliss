const express = require('express')
const mysql = require("mysql2")
const app = express()
const port = 3000
const config = require('./config');

app.set('view engine', 'pug')

// MySQL connection
const connection = mysql.createConnection(config.databaseUrl);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
  res.render("index")
})

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

// app.get("/admin", (req, res) => )

// app.get('/books')
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})