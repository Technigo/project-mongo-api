import React, { useState } from "react";

import { VolcanoList } from "./components/VolcanoList";
import { Volcano } from "./components/Volcano";
import { Header } from "./components/Header";
import { Loading } from "./components/Loading";

import "./App.scss";

function App() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [volcanos, setVolcanos] = useState([]);
  const [selectedVolcano, setSelectedVolcano] = useState("");
  const [sort, setSort] = useState("");

  const [searchByName, setSearchByName] = useState("");
  const [searchByCountry, setSearchByCountry] = useState("");
  const [searchMinHeight, setSearchMinHeight] = useState("");

  console.log(loading);

  return (
    <>
      {loading && <Loading />}
      <Header
        setSearchByName={setSearchByName}
        setSearchByCountry={setSearchByCountry}
        setSearchMinHeight={setSearchMinHeight}
        setSort={setSort}
        sort={sort}
      />
      {!selectedVolcano ? (
        <VolcanoList
          setLoading={setLoading}
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
