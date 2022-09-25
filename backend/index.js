const path = require('path');
const connection = require("./connection");
const mongoose = require('mongoose');

const app = require("./app");
const port = process.env.PORT || 3001;
console.log(process.env.DB_PATH);
mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });


let server = app.listen(port, () => console.log('yoooo App listening on port ' + port));

let io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});
require("./connection.js")(io, app);