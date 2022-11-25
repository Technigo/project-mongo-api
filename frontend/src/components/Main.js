/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Main = () => {
  const [gamesList, setGamesList] = useState([]);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    fetch('https://project-mongo-api-pi3gkxc3ea-lz.a.run.app/games')
      .then((data) => data.json())
      .then((json) => setGamesList(json.nesGames))
  }, []);

  const onGameSearch = (event) => {
    setTextInput(event.target.value);
  }

  return (
    <section className="list-section">
      <h1>All games to the Nintendo Entertainment System:</h1>
      <input type="text" onChange={onGameSearch} placeholder="Search for games..." />
      {gamesList.map((game) => {
        if (game.title.includes(textInput)) {
          return (
            <Link key={game._id} to={`/details/${game._id}`}>
              <p>{game.title}</p>
            </Link>
          )
        } else {
          return (<div key={game.id}> </div>)
        }
      })}
    </section>
  )
}
export default Main;