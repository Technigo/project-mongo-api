import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [route, setRoute] = useState('/');
  const [songId, setSongId] = useState('');
  const [danceability, setDanceability] = useState('');
  const API_URL = 'https://project-mongo-api-7ammel5u7a-lz.a.run.app/'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${API_URL}${route}`;
        if (route === '/songs/id') {
          url += `/${songId}`;
        } else if (route === '/songs') {
          url += `?danceability=${danceability}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [route, songId, danceability]);

  const handleClick = (route) => {
    setRoute(route);
  }

  return (
    <div className="App">
      <button onClick={() => handleClick('/')}>Home</button>
      <button onClick={() => handleClick('/songs')}>Songs</button>
      <button onClick={() => handleClick('/songs/id')}>Song by ID</button>
      <div>
        {route === '/songs/id' && (
          <input 
            type="number" 
            placeholder="Enter song ID"
            value={songId}
            onChange={e => setSongId(e.target.value)}
          />
        )}
        {route === '/songs' && (
          <input 
            type="number" 
            placeholder="Enter danceability score"
            value={danceability}
            onChange={e => setDanceability(e.target.value)}
          />
        )}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;

