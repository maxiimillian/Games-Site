const path = require('path');
const connection = require("./connection")
const mongoose = require('mongoose');

const app = require("./app");

const port = 3001;


mongoose.connect("mongodb://localhost/PlaceholdrDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let server = app.listen(port, () => console.log('App listening on port ' + port));
let io = require("socket.io")(server, {
  cors: {
    origin: "http://10.0.0.124:3000",
    methods: ["GET", "POST"]
  }
});
require("./connection.js")(io);

