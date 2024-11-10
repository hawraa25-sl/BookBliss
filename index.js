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
  const query = 'SELECT * FROM Books';
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Error fetching books' });
    } else {
      res.render('index', {
        title: "My first page",
        message: "Hello World!",
        books: results
      })
    }
  });
})

// app.get('/books')
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})