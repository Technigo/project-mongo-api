const topsongs = require("./500topsongs.json");

const testString = "no. 32";

const returnOnlyNumber = (stringy) => {
  if (+stringy.match(/\d+/g)) return +stringy.match(/\d+/g)[0]
  return 0
}

const newTopSongs = topsongs.map((song) => {
  song.position = returnOnlyNumber(song.position)
  return song
});

module.exports = { newTopSongs }  