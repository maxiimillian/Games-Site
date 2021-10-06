const TokenModel = require("../models/Token");
const UserModel = require("../models/User");

module.exports = async function refreshToken(token, user_id, callback) {
    try {
        if (token) {
            TokenModel.findOne({token: token}, function (err, tokenObj) {

                if (err) {
                    throw err;
                }
                if (tokenObj == null) {
                    callback(null, null);
                }

                UserModel.findOne({user_id: user_id}, function(err, user) {

                    if (err) {
                        throw err;
                    }
                    else if (user == null) {
                        callback(null, null);
                    } else {
                        callback(null, {"user": user.username, "bio": user.bio, "profile": user.profile});
                    }
                });
            });
        }
    } catch (err) {
        callback(err, null);
    }

}