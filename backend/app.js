const express = require('express');
const cors = require("cors");

const auth = require('./routes/auth')
const poker = require('./routes/poker')
const sudoku = require("./routes/sudoku");
const meta = require("./routes/meta/meta");

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
app.use("/meta", meta);

app.get("/", (req, res) => {
  res.status(200).json({success: true})
});


app.use((req, res, next) => {
    console.log("called2");
    next();
})

module.exports = app;