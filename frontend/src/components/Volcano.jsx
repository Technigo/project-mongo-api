import React, { useState, useEffect } from "react";

export const Volcano = ({ selectedVolcano, setSelectedVolcano }) => {
  const [theVolcano, setTheVolcano] = useState();

  const URL = `https://my-volcanos.herokuapp.com/volcanos/${selectedVolcano}`;

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTheVolcano(data);
      });
  }, [URL]);

  return (
    <article>
      <div className="volcano-top-container">
        <h3>{theVolcano?.Name}</h3>
        <button onClick={() => setSelectedVolcano(null)}>back</button>
      </div>

      <p className="country-paragraph">
        {theVolcano?.Country}, {theVolcano?.Region}
      </p>

      <p>
        <span>Type: </span>
        {theVolcano?.Type}
      </p>
      <p>
        <span>Activity evidence: </span>
        {theVolcano?.ActivityEvidence}
      </p>
      <p>
        <span>Elevation meters: </span>
        {theVolcano?.ElevationMeters}
      </p>
      <p>
        <span>Last known eruption: </span>
        {theVolcano?.LastKnownEruption}
      </p>
      <p>
        <span>Latitude: </span>
        {theVolcano?.Latitude}
      </p>
      <p>
        <span>Longitude: </span>
        {theVolcano?.Longitude}
      </p>
      <p>
        <span>Dominant rock type: </span>
        {theVolcano?.DominantRockType}
      </p>
      <p>
        <span>Tectonic setting: </span>
        {theVolcano?.TectonicSetting}
      </p>
    </article>
  );
};
