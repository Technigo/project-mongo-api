import React from "react";

export const Header = ({
  setSearchByName,
  setSearchByCountry,
  setSearchMinHeight,
  sort,
  setSort,
}) => {
  const handleOnChangeName = (event) => {
    setSearchByName(event.target.value);
  };

  const handleOnChangeCountry = (event) => {
    setSearchByCountry(event.target.value);
  };

  const handleOnChangeHeight = (event) => {
    setSearchMinHeight(event.target.value);
  };

  return (
    <header>
      <div className="header-left-container">
        <h1>Cool volcanos</h1>

        <select onChange={(event) => setSort(event.target.value)} value={sort}>
          <option value="">Sort volcanos</option>
          <option value="name">Name</option>
          <option value="country">Country</option>
          <option value="height">Height</option>
        </select>
      </div>

      <div className="header-right-container">
        <input
          type="text"
          placeholder="Find volcano"
          onChange={(event) => handleOnChangeName(event)}
        />

        <input
          type="text"
          placeholder="Find country"
          onChange={(event) => handleOnChangeCountry(event)}
        />
        <input
          type="number"
          placeholder="Min height"
          onChange={(event) => handleOnChangeHeight(event)}
        />
      </div>
    </header>
  );
};
