const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/picture/:day", (req, res) => {
  let requested_day = req.params["day"];
  let date = new Date();
  let day = date.getDate();

  if (requested_day > 0 && requested_day <= day) {
    res.sendFile(
      path.resolve(__dirname, `../images/advent_${requested_day}.png`)
    );
  } else {
    res.sendFile(path.resolve(__dirname, `../images/hidden.png`));
  }
});

module.exports = router;
