const { 
    insertNewBooks, 
    getAllBooks,
    getDetailBooksById,
    updateBooksById,
    removeBooksById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: insertNewBooks,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBooksById,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBooksById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: removeBooksById,
  },
];
 
module.exports = routes;