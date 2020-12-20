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

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setVolcanos(data);
      });
  }, [URL, setVolcanos]);

  const handleOnClickVolcano = (Name) => {
    setSelectedVolcano(Name);
  };

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
              <p>{volcano.ElevationMeters}&nbsp;m</p>
            </button>
          </div>
        ))}
      </main>
      <VolcanoListFooter page={page} setPage={setPage} volcanos={volcanos} />
    </>
  );
};
