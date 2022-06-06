const TokenModel = require("../models/Token");
const UserModel = require("../models/User");

var crypto = require("crypto");
const bcrypt = require('bcrypt');

module.exports = async function loginUser(username, password, callback) {
    console.log("logging in?")
    try {
        if (username != null && password != null) {
            console.log(1);
            UserModel.findOne({username: username}, (err, user) => {
                console.log(2);
                if (err) {
                    throw err;
                }

                if (user == null) {
                    callback(null, null)
                    return
                }
    
                bcrypt.compare(password, user.password, (err, result) => {
                    console.log(3);
                    if (err) {
                        throw err;
                    }
    
                    if (result) {
                        console.log(4);
                        TokenModel.findOne({user_id: user.user_id}, (err, token) => {
    
                            if (err) {
                                throw err;
                            }
                            console.log(5);
                            let new_token = crypto.randomBytes(20).toString('hex');
    
                            if (token != null) {
                                console.log(8);
                                TokenModel.updateOne({user_id: user.user_id}, {token: new_token}, function(err, _) {
                                    if (err) {
                                        throw err;
                                    }
                                    callback(null, new_token);
                                    return
                                });  
                            } else {
                                console.log(9);
                                let information = {token: crypto.randomBytes(20).toString('hex'), user_id: user.user_id};
    
                                TokenModel.create(information, (err, _new_token) => {
    
                                    if (err) {
                                        throw err;
                                    }
                            
                                    callback(null, information.token);
                                    return
                                });
                            }
                        });
                    } else {    
                        console.log(13);
                        callback(null, null)
                        return
                    }
                });
    
            });
        } else {
            callback(null, null);
            return
        }
    } catch (err) {
        console.log(err);
        callback(err, null);
    }

}