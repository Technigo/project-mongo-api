import React from 'react';

export const Skotrum = ({ resto }) => {
  return (
    <div>
      <h1>{resto.title}</h1>
      <h3>{resto.adress}</h3>
      <h3>{resto.phone}</h3>
    </div>
  );
};
