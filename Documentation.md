## The endpoints

Base url https://mongo-api-technigo.herokuapp.com/

Books https://mongo-api-technigo.herokuapp.com/books/search

Listing all books.

To query for a specific book write `?author={query}`, `?title={query}`,
`?language={query}` or `?rating={query}`. If you want to combine two or more use
&& between (ie. `?author={query}&&?rating={query}`).

The rating will show the rating you type in and higher. The query for author,
title and language will look for books containing part of the word you've typed
with RegEx.

ISBN or ISBN13 https://mongo-api-technigo.herokuapp.com/books/isbn

Search for either isbn or isbn13 and get the correct book.

https://mongo-api-technigo.herokuapp.com/books/authors

Lists all authors in undefined order.

https://mongo-api-technigo.herokuapp.com/books/rating

All books sorted highest to lowest based on rating.

https://mongo-api-technigo.herokuapp.com/books/randombook

Shows a random book from the database.

https://mongo-api-technigo.herokuapp.com/books/id/{id}

To list a single book, add the individual id in the endpoint.
