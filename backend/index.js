const express = require('express');
const path = require('path');
const connection = require("./connection")
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require("cors");

const auth = require('./routes/auth')
const poker = require('./routes/poker')
const sudoku = require("./routes/sudoku");

const port = 3001;

const app = express();

const expressSession = require('express-session')({
  secret: 'dog volcano mine coral book',
  resave: false,
  saveUninitialized: false
});

mongoose.connect("mongodb://localhost/PlaceholdrDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: "*",
}));

app.use(expressSession)
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/auth', auth);
app.use('/poker', poker);
app.use("/sudoku", sudoku);



let server = app.listen(port, () => console.log('App listening on port ' + port));
let io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
require("./connection.js")(io);

export default app;