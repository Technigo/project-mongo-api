import React, { useEffect, useState } from "react";

export const VolcanoList = () => {
  const [volcanos, setVolcanos] = useState([]);
  const [selectedVolcano, setSelectedVolcano] = useState();

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

  const handleOnClickVolcano = (Number) => {
    setSelectedVolcano(Number);
    console.log("clicked", Number);
  };

  return (
    <>
      <main>
        {volcanos.map((volcano) => (
          <article>
            <button onClick={() => handleOnClickVolcano(volcano.Number)}>
              <p>{volcano.Name}</p>
            </button>
          </article>
        ))}
      </main>
    </>
  );
};
