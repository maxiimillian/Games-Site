var connection = require("./connection")
const UserModel = require('./models/User');
var crypto = require("crypto");
const TokenModel = require("./models/Token");

module.exports = {
    get_user_id: function(username) {
        UserModel.findOne({username: username}, (err, user) => {
            if (err) throw err;
            if (user == null) {
                throw "User not found"
            } else {
                return user.id
            }
        });
    },

    is_valid_email: function(email_string, callback) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        UserModel.findOne({email: email_string}, (err, user) => {
            if (err) throw err;
            callback(re.test(email_string) && user == null);
        });
        return;
    },

    is_valid_username: function(username, callback) {
        UserModel.findOne({username: username}, (err, user) => {
            if (err) throw err;
            console.log("here", username.length < 20 && user == null);
            callback(username.length < 20 && user == null);
        });
    },

    is_valid_password: function(password) {
        return password.length < 20;
    },

    generate_token: function(user_id, callback) {
        let token = crypto.randomBytes(20).toString('hex');
        let information = {token: token, user_id: user_id};
        
        TokenModel.create(information, (err, token) => {
            if (err) {
                callback(err);
            } else {
                callback(null, token);
            }
        });
        return;
    },

}