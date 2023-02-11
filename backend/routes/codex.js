const express = require("express");
const path = require("path");

const router = express.Router();
const answers = require("./answers.json");

router.get("/:number", (req, res) => {
  let guess = req.query.guess.toLowerCase();
  let number = req.params["number"];
  if (guess == answers[number.toString()]) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

module.exports = router;
