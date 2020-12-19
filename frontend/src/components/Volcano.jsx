import React, { useState, useEffect } from "react";

export const Volcano = ({ selectedVolcano }) => {
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
    <div>
      <h3>{theVolcano?.Name}</h3>
    </div>
  );
};
