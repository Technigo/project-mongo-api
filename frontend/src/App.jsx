import { useState, useEffect } from 'react';
import './App.css'

export const App = () => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch all songs from the backend
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8080/songs'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        setError('Error fetching data');
      }
    };

    // Call the fetchSongs function
    fetchSongs();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
    <div>
      <h1>Your Music App</h1>
      {error && <p>{error}</p>}
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <strong>{song.trackName}</strong> by {song.artistName}
          </li>
        ))}
      </ul>
    </div>
  );
}


