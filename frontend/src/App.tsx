import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, IconButton, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getBooks } from './services/api';

interface Book {
  id: string;
  title: string;
  author: string;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getBooks().then(response => setBooks(response.data)).catch(console.error);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>BookBliss</Typography>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Welcome to BookBliss
        </Typography>
        <Grid container spacing={4}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography color="text.secondary">{book.author}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
