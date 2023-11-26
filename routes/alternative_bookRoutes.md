// Easier to understand:

// Route to get all books
router.get('/books', async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.json(allBooks);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route to get a book by ID
router.get('/books/:bookID', async (req, res) => {
  const bookID = req.params.bookID;

  try {
    const book = await Book.findOne({ bookID });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route to get books by title
router.get('/books/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const books = await Book.find({ title });

    if (books.length > 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: 'No books found with the specified title' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route to get books by author
router.get('/books/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const books = await Book.find({ authors: author });

    if (books.length > 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: 'No books found by the specified author' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});


// Destructured approach examples

// Route to get a book by ID
router.get('/books/:bookID', async ({ params: { bookID } }, res) => {
  try {
    const book = await Book.findOne({ bookID });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route to get books by title
router.get('/books/title/:title', async ({ params: { title } }, res) => {
  try {
    const books = await Book.find({ title });

    if (books.length > 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: 'No books found with the specified title' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

