module.exports = {
  apps : [{
    name: "book-api",
    script: "./dist/server.js",
    interpreter: "./node_modules/.bin/babel-node"
  }]
}