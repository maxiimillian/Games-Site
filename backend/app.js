const express = require('express');
const cors = require("cors");

const auth = require('./routes/auth')
const poker = require('./routes/poker')
const sudoku = require("./routes/sudoku");

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/auth', auth);
app.use('/poker', poker);
app.use("/sudoku", sudoku);

app.use((req, res, next) => {
    console.log("called2");
    next();
})

app.get("/test", (req, res) => {
    console.log("called2");
    res.status(200).json({test: "Test"});
})

module.exports = app;