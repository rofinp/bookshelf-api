import express from 'express';
import {
  addBookHandler, getBooksHandler, getBookHandler, updateBookHandler, deleteBookHandler,
} from './handler.js';

const router = express.Router();

// Route to add a new book
router.post('/books', addBookHandler);
// Route to get all books
router.get('/books', getBooksHandler);
// Route to get a book
router.get('/books/:bookId', getBookHandler);
// Route to update a book
router.put('/books/:bookId', updateBookHandler);
// Route to delete a book
router.delete('/books/:bookId', deleteBookHandler);

export default router;
