const express = require("express");
const cors = require("cors");

const auth = require("./routes/auth");
const meta = require("./routes/meta/meta");
const advent = require("./routes/advent");
const codex = require("./routes/codex");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/auth", auth);
app.use("/meta", meta);
app.use("/advent", advent);
app.use("/codex", codex);

app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = app;
