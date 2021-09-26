const express = require('express');
const session = require('express-session');
const path = require('path');
const connection = require("./connection")
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy; 
const passportLocalMongoose = require('passport-local-mongoose');
const cors = require("cors");

const auth = require('./routes/auth')
const poker = require('./routes/poker')
const sudoku = require("./routes/sudoku");

const User = require('./models/User');

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
  origin: "http://localhost:3000",
}));

app.use(expressSession)
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/auth', auth);
app.use('/poker', poker);
app.use("/sudoku", sudoku);

app.use(passport.initialize());
app.use(passport.session());


app.listen(port, () => console.log('App listening on port ' + port));