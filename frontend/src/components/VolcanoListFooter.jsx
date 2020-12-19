import React from "react";

export const VolcanoListFooter = ({ page, setPage, volcanos }) => {
  const handleOnClick = (step) => {
    setPage((prev) => prev + step);
    window.scrollTo(0, 0);
  };

  return (
    <footer>
      <div>
        {page > 1 && <button onClick={() => handleOnClick(-1)}>back</button>}
        {volcanos.length > 0 && (
          <button onClick={() => handleOnClick(1)}>next</button>
        )}
        {volcanos.length === 0 && <p>Sorry, no volcanos found</p>}
      </div>
    </footer>
  );
};
