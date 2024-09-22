import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this to match your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getBooks = () => api.get('/books');
export const getBook = (id: string) => api.get(`/books/${id}`);
// Add more API calls as needed

export default api;