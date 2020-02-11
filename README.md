# Mongo API Project - Pokedex

API with simple data about Pokemons stored in MongoDB

## Details

### Models
```
Pokemon {
    "pokemonNo": Number,
    "name": String,
    "type": Array,
    "HP": Number,
    "Attack": Number,
    "Defense": Number,
    "SpAttack": Number,
    "SpDefense": Number,
    "Speed": Number
  }
  ```
```
Type {
  "type": String,
  "color": String
}
```
  
### Endpoints

API has 4 endpoints:

* /poke -json with list of all pokemons stored as objects
* /poke/:name  -json with single pokemon object
* /types  -json with list of all types of pokemon stored as object
* /types/:type  -json with single type object

## View it live

### Endpoints 

* https://pokedex-cislowski.herokuapp.com/poke
* https://pokedex-cislowski.herokuapp.com/poke/Pikachu
* https://pokedex-cislowski.herokuapp.com/types
* https://pokedex-cislowski.herokuapp.com/types/Normal

### SPA

Simple SPA create in React:
* https://github.com/KarolCislowski/PokedexSPA
* https://pokedex-cislowski.netlify.com/
