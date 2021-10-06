const TokenModel = require("../models/Token");
const UserModel = require("../models/User");

var crypto = require("crypto");
const bcrypt = require('bcrypt');
const utils = require("../utils");

const SALT_ROUNDS = 10;

module.exports = async function createUser(username, email, password, callback) {
    try {
        utils.is_valid_username(username, (is_valid_username) => {
            utils.is_valid_email(email, function (is_valid_email) {
                if (is_valid_username && is_valid_email && utils.is_valid_password(password)) {
            
                    bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
                        if (err) {
                            throw err;
                        }
                        
                        let user_id = crypto.randomBytes(20).toString('hex');
                        let user_information = {user_id: user_id, username: username, password: hash, email: email};

                        UserModel.create(user_information, (err, user) => {
                            if (err) {
                                throw err;
                            }

                            token_information = {token: crypto.randomBytes(20).toString('hex'), user_id: user_id};
            
                            TokenModel.create(token_information, (err, token) => {
                                if (err) throw err; 
                    
                                callback(null, {"user_id": user_id, "token": token.token});
                            })
                        });
                    });

                } else {
                    callback(null, null);
                }
            })
    
        }) 
    } catch (err) {
        callback(err, null);
    }

}