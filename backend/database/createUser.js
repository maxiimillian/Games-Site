const TokenModel = require("../models/Token");
const UserModel = require("../models/User");

var crypto = require("crypto");
const bcrypt = require("bcrypt");
const utils = require("../utils");

const saltRounds = 10;

module.exports = async function createUser(
  username,
  email,
  password,
  callback
) {
  try {
    utils.is_valid_username(username, (isValidUsername) => {
      utils.is_valid_email(email, (isValidEmail) => {
        if (
          isValidUsername &&
          isValidEmail &&
          utils.is_valid_password(password)
        ) {
          bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
              throw err;
            }

            let userId = crypto.randomBytes(20).toString("hex");
            let user_information = {
              user_id: userId,
              username: username,
              password: hash,
              email: email,
            };

            UserModel.create(user_information, (err, user) => {
              if (err) {
                throw err;
              }

              token_information = {
                token: crypto.randomBytes(20).toString("hex"),
                user_id: userId,
              };

              TokenModel.create(token_information, (err, token) => {
                if (err) throw err;

                callback(null, { user_id: userId, token: token.token });
              });
            });
          });
        } else {
          callback(null, null);
        }
      });
    });
  } catch (err) {
    callback(err, null);
  }
};
