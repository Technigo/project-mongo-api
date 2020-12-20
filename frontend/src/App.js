import React, { useState } from "react";
import "./App.scss";
import { VolcanoList } from "./components/VolcanoList";
import { Volcano } from "./components/Volcano";
import { Header } from "./components/Header";

function App() {
  const [page, setPage] = useState(1);
  const [volcanos, setVolcanos] = useState([]);
  const [selectedVolcano, setSelectedVolcano] = useState("");
  const [sort, setSort] = useState("");

  const [searchByName, setSearchByName] = useState("");
  const [searchByCountry, setSearchByCountry] = useState("");
  const [searchMinHeight, setSearchMinHeight] = useState("");

  return (
    <>
      <Header
        setSearchByName={setSearchByName}
        setSearchByCountry={setSearchByCountry}
        setSearchMinHeight={setSearchMinHeight}
        setSort={setSort}
        sort={sort}
      />
      {!selectedVolcano ? (
        <VolcanoList
          volcanos={volcanos}
          setVolcanos={setVolcanos}
          setSelectedVolcano={setSelectedVolcano}
          searchByName={searchByName}
          searchByCountry={searchByCountry}
          searchMinHeight={searchMinHeight}
          sort={sort}
          page={page}
          setPage={setPage}
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
