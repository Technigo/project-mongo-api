import React, { useEffect, useState } from "react";

export const VolcanoList = () => {
  const [volcanos, setVolcanos] = useState([]);

  const URL = "https://my-volcanos.herokuapp.com/volcanos";

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

  return (
    <div>
      {volcanos.map((volcano) => (
        <p>{volcano.Name}</p>
      ))}
    </div>
  );
};
