const connection = require("./connection");
const UserModel = require("./models/User");
const crypto = require("crypto");
const TokenModel = require("./models/Token");
const { devNull } = require("os");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

//Retrieves from DB file generated by a rust program
//Code for that is here -> https://github.com/maxiimillian/board_generator
let db = new sqlite3.Database(process.env.BOARD_DB_PATH);

module.exports = {
  get_user_information: function (user_id, callback) {
    UserModel.findOne({ user_id: user_id }, (err, user) => {
      if (err) {
        callback(err);
      } else if (user == null) {
        callback(null, { username: "Guest", profile_url: "guest.png" });
      } else {
        callback(null, {
          username: user.username,
          user_id: user.user_id,
          profile_url: user.profile_url,
        });
      }
      return;
    });
  },

  is_valid_email: function (email_string, callback) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    UserModel.findOne({ email: email_string }, (err, user) => {
      if (err) throw err;
      callback(re.test(email_string) && user == null);
    });
  },

  is_valid_username: function (username, callback) {
    UserModel.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      callback(username.length < 20 && user == null);
    });
    return;
  },

  is_valid_password: function (password) {
    return true;
    return password.length < 20;
  },

  generate_token: function (user_id, callback) {
    let token = crypto.randomBytes(20).toString("hex");
    let information = { token: token, user_id: user_id };

    TokenModel.create(information, (err, token) => {
      if (err) {
        callback(err);
      } else {
        callback(null, token);
      }
    });
    return;
  },

  generate_room_code: function (length) {
    let possibilties = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];

    let code = "";

    for (let i = 0; i < length; i++) {
      let random =
        possibilties[Math.floor(Math.random() * possibilties.length)];
      code = code + random;
    }

    return code;
  },

  get_board: function (difficulty) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM boards WHERE difficulty=? ORDER BY RANDOM() LIMIT 1`,
        [difficulty],
        (err, row) => {
          if (err || row.length == 0) {
            reject(err);
          } else {
            resolve(row[0]);
          }
        }
      );
    });
  },

  get_user_id: function (token, callback) {
    return TokenModel.findOne({ token: token }, function (err, tokenObj) {
      if (err || tokenObj == null) {
        callback(new Error("Invalid Token"), null);
      } else {
        callback(null, tokenObj.user_id);
      }
    });
  },

  is_valid_post: function (title, content, tags, callback) {
    if (title.length > 150 || title.length == 0) {
      callback("Invalid Title");
    } else if (content.length > 4000 || content.length == 0) {
      callback("Invalid Content");
    } else if (!this.is_valid_tags(tags)) {
      callback("Invalid tags");
    } else {
      callback(null);
    }
    return;
  },

  is_valid_tags: function (tags) {
    const VALID_TAGS = [
      "Sudoku",
      "Poker",
      "Crossword",
      "Tic-Tac-Toe",
      "Suggestions",
      "Bugs",
      "Other",
    ];
    if (!Array.isArray(tags)) {
      return false;
    }
    tags.forEach((tag) => {
      if (!VALID_TAGS.includes(tag)) {
        return false;
      }
    });
    return true;
  },
};
