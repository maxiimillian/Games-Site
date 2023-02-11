const TokenModel = require("../models/Token");
const UserModel = require("../models/User");

module.exports = async function getProfilePicture(userId, callback) {
  try {
    if (token) {
      TokenModel.findOne({ token: token }, function (err, tokenObj) {
        if (err) {
          throw err;
        }

        if (tokenObj == null) {
          callback(null, null);
          return;
        }

        UserModel.findOne({ user_id: tokenObj.user_id }, function (err, user) {
          if (err) {
            throw err;
          } else if (user == null) {
            callback(null, { user: null, bio: null, profile: null });
          } else {
            callback(null, {
              user: user.username,
              bio: user.bio,
              profile: user.profile,
            });
            return;
          }
        });
      });
    }
  } catch (err) {
    callback(err, null);
    return;
  }
};
