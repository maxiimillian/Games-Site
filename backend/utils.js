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

    get_user_information: function(user_id, callback) {
        UserModel.findOne({username: username}, (err, user) => {
            if (err) {
                callback(err)
            }
            else if (user == null) {
                callback(new Error("User not found"));
            } else {
                callback(null, {"username": user.username, "user_id": user.user_id, "profile_url": user.profile_url});
            }
        })
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

    generate_room_code: function(length) {
        let possibilties = [
            "A","B","C","D","E","F","G","H","I","J","K",
            "L","M","N","O","P","Q","R","S","T","U","V",
            "W","X","Y","Z","a","b","c","d","e","f","g",
            "h","i","j","k","l","m","n","o","p","q","r",
            "s","t","u","v","w","x","y","z"];

        let code = ""

        for (let i = 0; i < length; i++) {
            let random = possibilties[Math.floor(Math.random() * possibilties.length)];
            code = code+random;
        }

        return code;
    }	



    

}