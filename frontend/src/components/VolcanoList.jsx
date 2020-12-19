import React, { useEffect, useState } from "react";

export const VolcanoList = ({ setSelectedVolcano }) => {
  const [volcanos, setVolcanos] = useState([]);

  const URL = "https://my-volcanos.herokuapp.com/volcanos?sort=name";

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
    </>
  );
};
