const topsongs = require("./500topsongs.json");

const returnOnlyNumber = (stringy) => {
  if (+stringy.match(/\d+/g)) return +stringy.match(/\d+/g)[0]
  return 0
}

let count = 1;

const newTopSongs = topsongs.map((song) => {
  song.position = returnOnlyNumber(song.position)
  song.id = count
  count += 1
  return song
});

module.exports = { newTopSongs }  