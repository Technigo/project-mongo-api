#BOOK REVIEWS by Elsa Carlström

---

##BASE URL

(/)

Displays all end available end points.

---

##BOOKS

(/books)
Displays all books sorted alphabetically according to title.

To query for books based on title add `?title={query}` to URL. To query for only part of the title is possible and the query is not case sensitive.

To query for books with an average rating above a specific rating number (1-5) add `?averageRanking={query}` to URL.

(/books/ratings)
Displays all books sorted according to average ranking.

(/books/id/:id)
Displays one book based on the book id.

---

##AUTHORS

(/authors)
Listing all authors.
To query for authors based on name add `?name={query}` to URL. To query for only part of the name is possible and the query is not case sensitive.

(/authors/:id)
Displays one author based on the author id.

(/authors/:id/books)
Displays all books connected to one author id.
