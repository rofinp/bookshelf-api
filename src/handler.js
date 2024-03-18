import { nanoid } from 'nanoid';
import books from './books.js';

export const addBookHandler = (req, res) => {
  try {
    const book = {
      id: nanoid(16),
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finished: req.body.pageCount === req.body.readPage,
      ...req.body,
    };

    if (!book.name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
    }
    if (book.readPage > book.pageCount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
    }

    books.push(book);

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: book.id,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  }
};

export const getBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  // Create a copy to avoid modifying original data
  let filteredBook = books.slice();

  filteredBook = filteredBook.filter((book) => {
    const nameMatch = name ? book.name.toLowerCase().includes(name.toLowerCase()) : true;
    const readingMatch = reading ? book.reading === Boolean(Number(reading)) : true;
    const finishedMatch = finished ? book.finished === Boolean(Number(finished)) : true;
    return nameMatch && readingMatch && finishedMatch;
  });

  const formattedBook = filteredBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: { books: formattedBook },
  });
};

export const getBookHandler = (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId || !bookId.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID buku tidak valid',
      });
    }

    // Create a copy to avoid modifying original data
    const filteredBook = books.slice();

    const book = filteredBook.find((data) => data.id === bookId);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { book },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  }
};

export const updateBookHandler = (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId || !bookId.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID buku tidak valid',
      });
    }

    if (!req.body.name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
    }

    if (req.body.readPage > req.body.pageCount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
      res.status(404).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
    }

    const updatedBook = {
      ...books[index],
      updatedAt: new Date().toISOString(),
      ...req.body,
    };

    books[index] = updatedBook;

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  }
};

export const deleteBookHandler = (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId || !bookId.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID buku tidak valid',
      });
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
    }

    books.splice(index, 1);

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  }
};
