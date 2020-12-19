import React, { useEffect, useState } from "react";

import { VolcanoListFooter } from "./VolcanoListFooter";

export const VolcanoList = ({ volcanos, setVolcanos, setSelectedVolcano }) => {
  const [page, setPage] = useState(1);

  const URL = `https://my-volcanos.herokuapp.com/volcanos?sort=${volcanos}&page=${page}`;

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setVolcanos(data);
      });
  }, [URL]);

  console.log(volcanos);

  const handleOnClickVolcano = (Name) => {
    setSelectedVolcano(Name);
    console.log("clicked", Name);
  };

  return (
    <>
      <main>
        {volcanos.map((volcano) => (
          <article>
            <button onClick={() => handleOnClickVolcano(volcano.Name)}>
              <p>{volcano.Name}</p>
              <p>{volcano.Country}</p>
            </button>
          </article>
        ))}
      </main>
      <VolcanoListFooter page={page} setPage={setPage} volcanos={volcanos} />
    </>
  );
};
