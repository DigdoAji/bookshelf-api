const { nanoid } = require('nanoid');
const bookshelf = require('./books');

// Adding New Book Item
const insertNewBooks = (request, h) => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }

    bookshelf.push({
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    });

    const isDataInserted = bookshelf.filter((bookInserted) => bookInserted.id === id).length > 0;
    if (isDataInserted) {
      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }).code(201);
    }

    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// Get All Book Item
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  
  if (name) {
    const booksNameFilter = bookshelf.filter((bookTitle) => bookTitle.name.toLowerCase().includes(name.toLowerCase()));
    return h.response({
      status: 'success',
      data: {
        books: booksNameFilter.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    }).code(200);
  }

  if (reading) {
    const readingBooksFilter = bookshelf.filter((bookStatus) => Number(bookStatus.reading) === Number(reading));
    return h.response({
      status: 'success',
      data: {
        books: readingBooksFilter.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    }).code(200);
  }
  
  if (finished) {
    const finishedBooksFilter = bookshelf.filter((bookDone) => Number(bookDone.finished) === Number(finished));
    return h.response({
      status: 'success',
      data: {
        books: finishedBooksFilter.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    }).code(200);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookshelf.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Get Detail Book Item By Id
const getDetailBooksById = (request, h) => {
    const { bookId } = request.params;
    const isBookFound = bookshelf.filter((bookDetail) => bookDetail.id === bookId)[0];

    if (isBookFound) {
      return h.response({
        status: 'success',
        data: {
          book: isBookFound,
        },
      }).code(200);
    }
    
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Update or Edit Book Item By Id
const updateBooksById = (request, h) => {
    const { bookId } = request.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }
    
    const isBookUpdated = bookshelf.findIndex((bookUpdated) => bookUpdated.id === bookId);
    if (isBookUpdated !== -1){
      bookshelf[isBookUpdated] = {
        ...bookshelf[isBookUpdated],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Delete Book Item By Id
const removeBooksById = (request, h) => {
    const { bookId } = request.params;
    const isBookDeleted = bookshelf.findIndex((bookDeleted) => bookDeleted.id === bookId);

    if (isBookDeleted !== -1){
      bookshelf.splice(isBookDeleted, 1);
      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }).code(200);
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { 
    insertNewBooks,
    getAllBooks,
    getDetailBooksById,
    updateBooksById,
    removeBooksById,
};