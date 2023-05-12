import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [route, setRoute] = useState('/');
  const API_URL = 'https://project-mongo-api-7ammel5u7a-lz.a.run.app/'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}${route}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [route]);

  const handleClick = (route) => {
    setRoute(route);
  }

  return (
    <div className="App">
      <button onClick={() => handleClick('/')}>Home</button>
      <button onClick={() => handleClick('/songs')}>Songs</button>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
