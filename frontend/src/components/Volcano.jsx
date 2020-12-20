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
        console.log("data", data);

        setTheVolcano(data);
      });
  }, [URL]);

  console.log("the volcano", theVolcano);

  return (
    <article>
      <h3>{theVolcano?.Name}</h3>
      <p>
        {theVolcano?.Country}, {theVolcano?.Region}
      </p>

      <p>Type: {theVolcano?.Type}</p>
      <p>Activity evidence: {theVolcano?.ActivityEvidence}</p>
      <p>Last Known Eruption: {theVolcano?.LastKnownEruption}</p>
      <p>Latitude: {theVolcano?.Latitude}</p>
      <p>Longitude: {theVolcano?.Longitude}</p>
      <p>Elevation meters: {theVolcano?.ElevationMeters}</p>
      <p>Dominant rock type: {theVolcano?.DominantRockType}</p>
      <p>Tectonic setting: {theVolcano?.TectonicSetting}</p>
      <button onClick={() => setSelectedVolcano(null)}>back</button>
    </article>
  );
};
