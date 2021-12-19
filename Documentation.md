# BOOK REVIEWS 📚

### by Elsa Carlström

---

## BASE URL

`https://book-reviews-by-elsisco.herokuapp.com/`
Displays all end available end points.

---

## BOOKS

`https://book-reviews-by-elsisco.herokuapp.com/books`

Displays all books sorted alphabetically according to title.

To query for books based on title add `?title={query}` to URL. A query for only part of the title is possible and the query is not case sensitive.

To query for books with an average rating above a specific rating number (1-5) add `?averageRanking={query}` to URL.

`https://book-reviews-by-elsisco.herokuapp.com/books/ratings`

Displays all books sorted according to average ranking.

`https://book-reviews-by-elsisco.herokuapp.com/books/id/:id`

Displays one book based on the book id.

---

## AUTHORS

`https://book-reviews-by-elsisco.herokuapp.com/authors`

Listing all authors.

To query for authors based on name add `?name={query}` to URL. A query for only part of the name is possible and the query is not case sensitive.

`https://book-reviews-by-elsisco.herokuapp.com/authors/:id`

Displays one author based on the author id.

`https://book-reviews-by-elsisco.herokuapp.com/authors/:id/books`

Displays all books connected to one author id.
