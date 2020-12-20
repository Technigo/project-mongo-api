import React, { useEffect } from "react";

import { VolcanoListFooter } from "./VolcanoListFooter";

export const VolcanoList = ({
  volcanos,
  sort,
  setVolcanos,
  setSelectedVolcano,
  searchByName,
  searchByCountry,
  searchMinHeight,
  page,
  setPage,
}) => {
  const URL = `http://localhost:8080/volcanos?page=${page}&sort=${sort}&Name=${searchByName}&Country=${searchByCountry}&height=${searchMinHeight}`;
  // const URL = `https://my-volcanos.herokuapp.com/volcanos?sort=${sort}&page=${page}&Name=${searchByName}&Country=${searchByCountry}`;

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setVolcanos(data);
      });
  }, [URL, setVolcanos]);

  console.log(volcanos);

  const handleOnClickVolcano = (Name) => {
    setSelectedVolcano(Name);
    console.log("clicked", Name);
  };
  console.log("page", page);
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
