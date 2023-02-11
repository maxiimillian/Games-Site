const express = require("express");
const connection = require("../connection");

const createUser = require("../database/createUser");
const refreshToken = require("../database/refreshToken");
const loginUser = require("../database/loginUser");
const getProfile = require("../database/getProfile");

const router = express.Router();

router.use(function (req, res, next) {
  next();
});

router.post("/profile", function (req, res) {
  let token = req.body.token;

  getProfile(token, (err, profile) => {
    if (err) {
      res.json({ success: false, message: "failed" });
      return;
    } else if (!profile) {
      res.json({ success: false, message: "Unknown User" });
      return;
    } else {
      res.json({ success: true, profile: profile });
      return;
    }
  });
});

router.post("/login", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  loginUser(username, password, (err, token) => {
    if (err) {
      res.status(400).json({ success: false, message: "failed" });
    } else if (!token) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Authentication" });
    } else {
      getProfile(token, (err, profile) => {
        if (err) {
          res
            .status(400)
            .json({
              success: false,
              message: "Something went wrong with profile",
            });
        } else {
          res
            .status(200)
            .json({ success: true, profile: profile, token: token });
        }
        res.end();
      });
    }
  });
});

router.post("/refresh", function (req, res) {
  let token = req.body.token;

  refreshToken(token, (err, new_token) => {
    if (err) {
      res.status(400).json({ success: false, message: "failed" });
    } else if (new_token == null) {
      res.status(400).json({ success: false, message: "failed" });
    } else {
      res.status(200).send({ success: true, token: new_token });
    }
    res.end();
  });
});

router.post("/register", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  if (!username || !email || !password) {
    res
      .status(400)
      .json({ success: false, message: "400 <Missing Information>" });
    res.end();
    return;
  } else {
    createUser(username, email, password, (err, user) => {
      if (err) {
        res.status(400).json({ success: false, message: "failed" });
        res.end();
      } else if (!user) {
        res
          .status(400)
          .json({ success: false, message: "400 <Missing Information>" });
        res.end();
      } else {
        getProfile(user.token, (err, profile) => {
          res
            .status(200)
            .send({ success: true, profile: profile, token: user.token });
          res.end();
        });
      }
    });
  }
});

module.exports = router;
