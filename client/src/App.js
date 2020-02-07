import React, { useState, useEffect } from 'react';
import { Skotrum } from 'components/skotrum';

export const App = () => {
  const [rest, setRest] = useState();
  const [page, setPage] = useState();
  const [totalPage, setTotalPage] = useSate();

  useEffect(() => {
    fetch(`mongodb://localhost/skotrum-mongo-project?page=${page}`)
      .then(res => res.json())
      .then(json => {
        setRest(json.skotrum);
        setTotalPage(json.totalPage);
      });
  }, [page]);
  return (
    <div>
      <h1>
        Showing page {page + 1} of {totalPage + 1}{' '}
      </h1>

      {rest.map(resto => (
        <Skotrum key={resto.id} resto={title} resto={adress} resto={phone} />
      ))}

      {page > 0 && (
        <button type="button" onCklick={() => setPage(page - 1)}>
          Previous
        </button>
      )}

      {page < totalPage && (
        <button type="button" onCklick={() => setPage(page + 1)}>
          Next page
        </button>
      )}
    </div>
  );
};
