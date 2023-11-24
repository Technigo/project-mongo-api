import { useState, useEffect } from 'react'
import { Songs } from "./Songs"
import './App.css'

function App() {
  const [songs, setSongs] = useState(null)
  const [danceable, setDanceable] = useState(null)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8080/songs')
        if (!response.ok) {
          throw new Error('Error fetching data')
        }
        const data = await response.json()
        setSongs(data)
      } catch (error) {
        console.log('Error fetching data')
      }
    }
    fetchSongs()

    const fetchDance = async () => {
      try {
        const response = await fetch('http://localhost:8080/danceable')
        if (!response.ok) {
          throw new Error('Error fetching data')
        }
        const data = await response.json()
        setDanceable(data)
      } catch (error) {
        console.log('Error fetching data')
      }
    }
    fetchDance()
  }, [])


  return (
    <>
      <div>
        <h1>SONGS FOR DANCING:</h1>
        <div className="dance-container">
          {danceable && danceable.map(item => <Songs key={item.id} title={item.trackName} artist={item.artistName} />)}
        </div>
        <h1>ALL SONGS:</h1>
        <div className="card-container">
          {songs && songs.map(item => <Songs key={item.id} title={item.trackName} artist={item.artistName} />)}
        </div>
      </div>
    </>
  )
}

export default App
