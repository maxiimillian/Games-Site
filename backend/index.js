import fs

const path = require('path');
const connection = require("./connection")
const mongoose = require('mongoose');

const app = require("./app");

const port = process.env.PORT || 3001;

mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxIdleTimeMS: 270000,
  minPoolSize: 2, 
  maxPoolSize: 4,
  ssl: true,
  sslCA: [fs.readFileSync("rds-combined-ca-bundle.pem")],
});

let server = app.listen(port, () => console.log('yoooo App listening on port ' + port));

let io = require("socket.io")(server, {
  cors: {
    origin: process.env.ALLOWED_URL,
    methods: ["GET", "POST"]
  }
});
require("./connection.js")(io, app);