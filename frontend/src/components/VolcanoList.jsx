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
  const URL = `https://my-volcanos.herokuapp.com/volcanos?page=${page}&sort=${sort}&Name=${searchByName}&Country=${searchByCountry}&height=${searchMinHeight}`;
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
          <div>
            <button
              className="button-card"
              onClick={() => handleOnClickVolcano(volcano.Name)}
            >
              <h2>{volcano.Name} / </h2>
              <p>{volcano.Country} / </p>
              <p>{volcano.ElevationMeters} m</p>
            </button>
          </div>
        ))}
      </main>
      <VolcanoListFooter page={page} setPage={setPage} volcanos={volcanos} />
    </>
  );
};
