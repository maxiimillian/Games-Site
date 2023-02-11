const TokenModel = require("../models/Token");
const UserModel = require("../models/User");

var crypto = require("crypto");
const bcrypt = require("bcrypt");

module.exports = async function loginUser(username, password, callback) {
  try {
    if (username != null && password != null) {
      UserModel.findOne({ username: username }, (err, user) => {
        if (err) {
          throw err;
        }

        if (user == null) {
          callback(null, null);
          return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            throw err;
          }

          if (result) {
            TokenModel.findOne({ user_id: user.user_id }, (err, token) => {
              if (err) {
                throw err;
              }
              let new_token = crypto.randomBytes(20).toString("hex");

              if (token != null) {
                TokenModel.updateOne(
                  { user_id: user.user_id },
                  { token: new_token },
                  function (err, _) {
                    if (err) {
                      throw err;
                    }
                    callback(null, new_token);
                    return;
                  }
                );
              } else {
                let information = {
                  token: crypto.randomBytes(20).toString("hex"),
                  user_id: user.user_id,
                };

                TokenModel.create(information, (err, _new_token) => {
                  if (err) {
                    throw err;
                  }

                  callback(null, information.token);
                  return;
                });
              }
            });
          } else {
            callback(null, null);
            return;
          }
        });
      });
    } else {
      callback(null, null);
      return;
    }
  } catch (err) {
    console.log(err);
    callback(err, null);
  }
};
