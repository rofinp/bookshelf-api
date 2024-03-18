import { nanoid } from 'nanoid';
import books from './books.js';

const serverErrorHandler = (res, error) => {
  console.error(error.message);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
};

export const addBookHandler = (req, res) => {
  try {
    const { name, readPage, pageCount } = req.body;
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
    }
    if (readPage > pageCount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
    }

    const book = {
      id: nanoid(16),
      insertedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finished: req.body.pageCount === req.body.readPage,
      ...req.body,
    };

    books.push(book);

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: book.id,
      },
    });
  } catch (error) {
    return serverErrorHandler(res, error);
  }
};

export const getBooksHandler = (req, res) => {
  try {
    const { name: qName, reading, finished } = req.query;

    // Create a copy to avoid modifying original data
    let filteredBook = books.slice();

    filteredBook = filteredBook.filter((book) => {
      const nameMatch = qName ? book.name.toLowerCase().includes(qName.toLowerCase()) : true;
      const readingMatch = reading ? book.reading === Boolean(Number(reading)) : true;
      const finishedMatch = finished ? book.finished === Boolean(Number(finished)) : true;
      return nameMatch && readingMatch && finishedMatch;
    });

    const formattedBook = filteredBook.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));

    return res.status(200).json({
      status: 'success',
      data: { books: formattedBook },
    });
  } catch (error) {
    return serverErrorHandler(res, error);
  }
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
    return serverErrorHandler(res, error);
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

    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
    }

    const {
      name, readPage, pageCount,
    } = req.body;
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
    }

    if (readPage > pageCount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
    }

    books[index] = {
      ...books[index],
      updatedAt: new Date().toISOString(),
      finished: pageCount === readPage,
      ...req.body,
    };

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  } catch (error) {
    return serverErrorHandler(res, error);
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
    return serverErrorHandler(res, error);
  }
};
