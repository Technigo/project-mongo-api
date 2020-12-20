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
      <h3>{theVolcano?.Name}</h3>

      <p className="country-paragraph">
        {theVolcano?.Country}, {theVolcano?.Region}
      </p>

      <p>
        <span className="key">Type:</span>{" "}
        <span className="value">{theVolcano?.Type}</span>
      </p>
      <p>
        <span className="key">Activity evidence:</span>{" "}
        <span className="value">{theVolcano?.ActivityEvidence}</span>
      </p>
      <p>
        <span className="key">Elevation meters:</span>{" "}
        <span className="value">{theVolcano?.ElevationMeters}</span>
      </p>
      <p>
        <span className="key">Last Known Eruption:</span>{" "}
        <span className="value">{theVolcano?.LastKnownEruption}</span>
      </p>
      <p>
        <span className="key">Latitude:</span>{" "}
        <span className="value">{theVolcano?.Latitude}</span>
      </p>
      <p>
        <span className="key">Longitude:</span>{" "}
        <span className="value">{theVolcano?.Longitude}</span>
      </p>
      <p>
        <span className="key">Dominant rock type:</span>{" "}
        <span className="value">{theVolcano?.DominantRockType}</span>
      </p>
      <p>
        <span className="key">Tectonic setting:</span>{" "}
        <span className="value">{theVolcano?.TectonicSetting}</span>
      </p>
      <button onClick={() => setSelectedVolcano(null)}>back</button>
    </article>
  );
};
