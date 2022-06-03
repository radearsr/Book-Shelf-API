const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  let finished = false;

  if (name !== undefined || name === "") {
    if (readPage <= pageCount) {
      if (pageCount === readPage) {
        finished = true;
      }
      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

      const newBooks = {
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
      };

      books.push(newBooks);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const res = h.response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: {
            bookId: id,
          },
        });

        res.code(201);

        return res;
      }
    } else {
      const res = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });

      res.code(400);

      return res;
    }
  } else {
    const res = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });

    res.code(400);

    return res;
  }

  const res = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });

  res.code(500);

  return res;
};

const getAllBooksHandler = (req, h) => {
  const {
    name = "",
    reading = "none",
    finished = "none",
  } = req.query;
  let filteringBooks;
  let status;

  if (name !== "") {
    filteringBooks = books.filter((book) => (book.name.toLowerCase().includes(name.toLowerCase())))
      .map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  } else if (reading !== "none") {
    status = parseFloat(reading) === 1;
    filteringBooks = books.filter((book) => (book.reading === status))
      .map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  } else if (finished !== "none") {
    status = parseFloat(finished) === 1;
    filteringBooks = books.filter((book) => (book.finished === status))
      .map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  } else {
    filteringBooks = books
      .map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  }

  const res = h.response({
    status: "success",
    data: {
      books: filteringBooks,
    },
  });

  return res;
};

const getDetailBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const resultBook = books.filter((book) => book.id === id)[0];

  if (resultBook !== undefined) {
    const res = h.response({
      status: "success",
      data: {
        book: resultBook,
      },
    });

    return res;
  }

  const res = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });

  res.code(404);

  return res;
};

const updateBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();
  let finished = false;

  const bookId = books.findIndex((book) => book.id === id);

  if (bookId !== -1) {
    if (name !== undefined && name !== "") {
      if (readPage <= pageCount) {
        if (readPage === pageCount) {
          finished = true;
        }

        books[bookId] = {
          ...books[bookId],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          finished,
          updatedAt,
        };

        const res = h.response({
          status: "success",
          message: "Buku berhasil diperbarui",
        });

        return res;
      }
      const res = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      res.code(400);
      return res;
    }
    const res = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    res.code(400);
    return res;
  }

  const res = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });

  res.code(404);
  return res;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const bookId = books.findIndex((book) => book.id === id);

  if (bookId !== -1) {
    books.splice(bookId, 1);

    const res = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });

    return res;
  }

  const res = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });

  res.code(404);
  return res;
};

const getAllReadOrUnreadBookHandler = (req, h) => {
  const { reading } = req.query;
  const readExpect = reading === 1;

  const bookFiltering = books.filter((book) => book.reading === readExpect)
    .map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));

  const res = h.response({
    status: "success",
    data: {
      books: bookFiltering,
    },
  });

  return res;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
  getAllReadOrUnreadBookHandler,
};
