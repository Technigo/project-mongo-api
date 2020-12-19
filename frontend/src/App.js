import React, { useState } from "react";
import "./App.css";
import { VolcanoList } from "./components/VolcanoList";
import { Volcano } from "./components/Volcano";

function App() {
  const [volcanos, setVolcanos] = useState([]);
  const [selectedVolcano, setSelectedVolcano] = useState("");

  return (
    <>
      {!selectedVolcano ? (
        <VolcanoList
          volcanos={volcanos}
          setVolcanos={setVolcanos}
          setSelectedVolcano={setSelectedVolcano}
        />
      ) : (
        <Volcano
          selectedVolcano={selectedVolcano}
          setSelectedVolcano={setSelectedVolcano}
        />
      )}
    </>
  );
}

export default App;
