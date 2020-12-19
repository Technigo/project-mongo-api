import React, { useState } from "react";
import "./App.css";
import { VolcanoList } from "./components/VolcanoList";
import { Volcano } from "./components/Volcano";

function App() {
  const [selectedVolcano, setSelectedVolcano] = useState("");

  return (
    <>
      {!selectedVolcano ? (
        <VolcanoList setSelectedVolcano={setSelectedVolcano} />
      ) : (
        <Volcano selectedVolcano={selectedVolcano} />
      )}
    </>
  );
}

export default App;
