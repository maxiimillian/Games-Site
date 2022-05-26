const fs = require("fs");
const path = require('path');
const connection = require("./connection")
const mongoose = require('mongoose');

const app = require("./app");

const port = process.env.PORT || 3001;

mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true,
  ssl: true,
  sslValidate: false,
  sslCA: './rds-combined-ca-bundle.pem',
});

let server = app.listen(port, () => console.log('yoooo App listening on port ' + port));

let io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});
require("./connection.js")(io, app);